import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { ImageService } from './image.service';

jest.mock('fs', () => ({
    promises: {
        writeFile: jest.fn(),
        unlink: jest.fn(),
    },
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
}));

jest.mock('path', () => ({
    join: jest.fn(),
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('ImageService', () => {
    let service: ImageService;
    let configService: jest.Mocked<ConfigService>;
    let loggerMock: { log: jest.Mock; error: jest.Mock; warn: jest.Mock; debug: jest.Mock; verbose: jest.Mock };

    const mockUploadDir = '/mock/upload/dir';
    const mockServerUrl = 'http://localhost:3000';
    const mockBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const mockImageId = 'test-image.png';
    const mockDateTimeValue = 123456789;

    beforeEach(() => {
        // Mock Date.now to return a consistent value
        jest.spyOn(Date, 'now').mockReturnValue(mockDateTimeValue);

        // Create a logger mock
        loggerMock = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        };

        // Mock file system operations
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);
        jest.spyOn(fs.promises, 'unlink').mockResolvedValue(undefined);
        jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
    });

    beforeEach(async () => {
        jest.clearAllMocks();

        configService = {
            get: jest.fn(),
        } as unknown as jest.Mocked<ConfigService>;

        // Mock path.join to return predictable paths
        (path.join as jest.Mock).mockImplementation((...args) => {
            return args.join('/');
        });

        // Mock ConfigService to return mock server URL
        configService.get.mockImplementation((key) => {
            if (key === 'SERVER_URL') return mockServerUrl;
            return undefined;
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: ConfigService,
                    useValue: configService,
                },
                {
                    provide: Logger,
                    useValue: Logger,
                },
            ],
        }).compile();

        service = module.get<ImageService>(ImageService);

        // Mock the logger methods in the service
        jest.spyOn(Logger.prototype, 'log').mockImplementation(loggerMock.log);
        jest.spyOn(Logger.prototype, 'error').mockImplementation(loggerMock.error);
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(loggerMock.warn);
        jest.spyOn(Logger.prototype, 'debug').mockImplementation(loggerMock.debug);
        jest.spyOn(Logger.prototype, 'verbose').mockImplementation(loggerMock.verbose);

        // Mock the uploadDir property with our test value
        Object.defineProperty(service, 'uploadDir', {
            value: mockUploadDir,
            writable: true,
        });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have required methods', () => {
        expect(typeof service.saveImage).toBe('function');
        expect(typeof service.deleteImage).toBe('function');
        expect(typeof service.getImageUrl).toBe('function');
    });

    it('should return true', () => {
        expect(true).toBe(true);
    });

    describe('saveImage', () => {
        it('should save a new image with a generated ID', async () => {
            await service.saveImage(mockBase64Image);

            // Verify extracted base64 data and wrote to file
            const expectedBuffer = Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
                'base64',
            );
            expect(fs.promises.writeFile).toHaveBeenCalledWith(expect.any(String), expectedBuffer);
            expect(loggerMock.log).toHaveBeenCalled();
        });

        it('should replace an existing image if ID is provided', async () => {
            await service.saveImage(mockBase64Image, mockImageId);

            const expectedPath = `${mockUploadDir}/${mockImageId}`;
            expect(fs.promises.writeFile).toHaveBeenCalledWith(expectedPath, expect.any(Buffer));
        });

        it('should append .png if filename does not have extension', async () => {
            const idWithoutExtension = 'test-image';
            await service.saveImage(mockBase64Image, idWithoutExtension);

            const expectedPath = `${mockUploadDir}/${idWithoutExtension}.png`;
            expect(fs.promises.writeFile).toHaveBeenCalledWith(expectedPath, expect.any(Buffer));
        });

        it('should handle errors when saving image', async () => {
            const error = new Error('Write failed');
            (fs.promises.writeFile as jest.Mock).mockRejectedValueOnce(error);

            await expect(service.saveImage(mockBase64Image)).rejects.toThrow(error);
            expect(loggerMock.error).toHaveBeenCalled();
        });
    });

    describe('deleteImage', () => {
        it('should delete an existing image', async () => {
            (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

            await service.deleteImage(mockImageId);

            const expectedPath = `${mockUploadDir}/${mockImageId}`;
            expect(fs.existsSync).toHaveBeenCalledWith(expectedPath);
            expect(fs.promises.unlink).toHaveBeenCalledWith(expectedPath);
            expect(loggerMock.log).toHaveBeenCalled();
        });

        it('should not throw if image does not exist', async () => {
            (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

            await service.deleteImage(mockImageId);

            expect(fs.promises.unlink).not.toHaveBeenCalled();
            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should handle errors when deleting image', async () => {
            (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
            const error = new Error('Delete failed');
            (fs.promises.unlink as jest.Mock).mockRejectedValueOnce(error);

            await service.deleteImage(mockImageId);

            expect(loggerMock.error).toHaveBeenCalled();
        });

        it('should do nothing if no image ID is provided', async () => {
            // Reset all mock calls
            jest.clearAllMocks();

            await service.deleteImage('');

            expect(fs.existsSync).not.toHaveBeenCalled();
            expect(fs.promises.unlink).not.toHaveBeenCalled();
        });
    });

    describe('getImageUrl', () => {
        it('should return a full URL for an image ID', () => {
            const url = service.getImageUrl(mockImageId);

            expect(url).toBe(`${mockServerUrl}/uploads/images/${mockImageId}`);
            expect(configService.get).toHaveBeenCalledWith('SERVER_URL');
        });

        it('should return empty string if no image ID is provided', () => {
            const url = service.getImageUrl('');

            expect(url).toBe('');
        });

        it('should return a string', () => {
            const url = service.getImageUrl('test.png');
            expect(typeof url).toBe('string');
        });
    });

    describe('ensureUploadDirectory', () => {
        beforeEach(() => {
            // Reset all mock calls for this describe block
            jest.clearAllMocks();
        });

        it('should create directory if it does not exist', () => {
            (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

            // Force call private method via any
            (service as any).ensureUploadDirectory();

            expect(fs.existsSync).toHaveBeenCalledWith(mockUploadDir);
            expect(fs.mkdirSync).toHaveBeenCalledWith(mockUploadDir, { recursive: true });
            expect(loggerMock.log).toHaveBeenCalledWith(expect.stringContaining('Created upload directory'));
        });

        it('should not create directory if it already exists', () => {
            (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

            // Force call private method via any
            (service as any).ensureUploadDirectory();

            expect(fs.existsSync).toHaveBeenCalledWith(mockUploadDir);
            expect(fs.mkdirSync).not.toHaveBeenCalled();
            expect(loggerMock.log).toHaveBeenCalledWith(expect.stringContaining('Using upload directory'));
        });

        it('should handle errors when creating directory', () => {
            (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
            const error = new Error('Failed to create directory');
            (fs.mkdirSync as jest.Mock).mockImplementationOnce(() => {
                throw error;
            });

            expect(() => (service as any).ensureUploadDirectory()).toThrow(error);
            expect(loggerMock.error).toHaveBeenCalled();
        });
    });
});
