import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as client from 'prom-client';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import Benefit from '../src/models/benefits/benefits';
import { BenefitsService } from '../src/services/benefits.service';
import { BenefitsController } from '../src/controllers/benefits.controller';
import {
  BenefitResponse,
  CreateBenefitResponse,
  UpdateBenefitResponse,
  ListBenefitsResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from './types/api-responses';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('Benefits API (e2e)', () => {
  let app: INestApplication;
  let createdBenefitId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:', // Use in-memory database for tests
          models: [Benefit],
          autoLoadModels: true,
          synchronize: true,
          logging: false, // Disable logging for cleaner test output
        }),
        SequelizeModule.forFeature([Benefit]),
      ],
      providers: [BenefitsService],
      controllers: [BenefitsController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Configure Swagger for E2E tests
    const config = new DocumentBuilder()
      .setTitle('API Benefícios')
      .setDescription('API para gerenciamento de benefícios')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Clear existing metrics and configure metrics endpoint for E2E tests
    client.register.clear();
    client.collectDefaultMetrics();
    app.getHttpAdapter().get('/metrics', async (req, res) => {
      res.setHeader('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /benefits', () => {
    it('should create a new benefit with valid data', async () => {
      const timestamp = Date.now();
      const createBenefitDto = {
        name: `Test Benefit E2E ${timestamp}`,
        description: 'Test benefit created during E2E testing',
      };

      const response = await request(app.getHttpServer())
        .post('/benefits')
        .send(createBenefitDto)
        .expect(201);

      const responseBody = response.body as CreateBenefitResponse;
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.name).toBe(createBenefitDto.name);
      expect(responseBody.description).toBe(createBenefitDto.description);
      expect(responseBody.isActive).toBe(true);
      expect(responseBody).toHaveProperty('createdAt');
      expect(responseBody).toHaveProperty('updatedAt');

      createdBenefitId = responseBody.id;
    });

    it('should fail to create benefit without name', async () => {
      const invalidDto = {
        description: 'Benefit without name',
      };

      const response = await request(app.getHttpServer())
        .post('/benefits')
        .send(invalidDto)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should fail to create benefit with empty name', async () => {
      const invalidDto = {
        name: '',
        description: 'Benefit with empty name',
      };

      const response = await request(app.getHttpServer())
        .post('/benefits')
        .send(invalidDto)
        .expect(400);

      const responseBody = response.body as ValidationErrorResponse;
      expect(responseBody).toHaveProperty('statusCode', 400);
      expect(Array.isArray(responseBody.message)).toBe(true);
    });

    it('should create benefit with only name (description optional)', async () => {
      const timestamp = Date.now();
      const createBenefitDto = {
        name: `Minimal Benefit ${timestamp}`,
      };

      const response = await request(app.getHttpServer())
        .post('/benefits')
        .send(createBenefitDto)
        .expect(201);

      const responseBody = response.body as CreateBenefitResponse;
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.name).toBe(createBenefitDto.name);
      expect(responseBody.isActive).toBe(true);
    });
  });

  describe('GET /benefits', () => {
    it('should return all benefits', async () => {
      const response = await request(app.getHttpServer())
        .get('/benefits')
        .expect(200);

      const responseBody = response.body as ListBenefitsResponse;
      expect(responseBody).toHaveProperty('data');
      expect(responseBody).toHaveProperty('total');
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(typeof responseBody.total).toBe('number');
    });

    it('should return paginated benefits', async () => {
      const response = await request(app.getHttpServer())
        .get('/benefits?page=1&limit=5')
        .expect(200);

      const responseBody = response.body as ListBenefitsResponse;
      expect(responseBody).toHaveProperty('data');
      expect(responseBody).toHaveProperty('total');
      expect(responseBody).toHaveProperty('page');
      expect(responseBody).toHaveProperty('limit');
      expect(responseBody.page).toBe(1);
      expect(responseBody.limit).toBe(5);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });
  });

  describe('GET /benefits/:id', () => {
    beforeEach(async () => {
      // Create a benefit for testing
      const createResponse = await request(app.getHttpServer())
        .post('/benefits')
        .send({
          name: 'Test Benefit for GET',
          description: 'Created for GET testing',
        });
      const createResponseBody = createResponse.body as CreateBenefitResponse;
      createdBenefitId = createResponseBody.id;
    });

    it('should return a specific benefit by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/benefits/${createdBenefitId}`)
        .expect(200);

      const responseBody = response.body as BenefitResponse;
      expect(responseBody).toHaveProperty('id', createdBenefitId);
      expect(responseBody).toHaveProperty('name');
      expect(responseBody).toHaveProperty('isActive');
    });

    it('should return 404 for non-existent benefit', async () => {
      const response = await request(app.getHttpServer())
        .get('/benefits/99999')
        .expect(404);

      const responseBody = response.body as ErrorResponse;
      expect(responseBody).toHaveProperty('statusCode', 404);
      expect(responseBody).toHaveProperty('message');
    });
  });

  describe('PUT /benefits/:id', () => {
    beforeEach(async () => {
      // Create a benefit for testing
      const createResponse = await request(app.getHttpServer())
        .post('/benefits')
        .send({
          name: 'Test Benefit for UPDATE',
          description: 'Created for UPDATE testing',
        });
      const createResponseBody = createResponse.body as CreateBenefitResponse;
      createdBenefitId = createResponseBody.id;
    });

    it('should update a benefit successfully', async () => {
      const updateDto = {
        name: 'Updated Benefit Name',
        description: 'Updated description',
      };

      const response = await request(app.getHttpServer())
        .put(`/benefits/${createdBenefitId}`)
        .send(updateDto)
        .expect(200);

      const responseBody = response.body as UpdateBenefitResponse;
      expect(responseBody).toHaveProperty('id', createdBenefitId);
      expect(responseBody.name).toBe(updateDto.name);
      expect(responseBody.description).toBe(updateDto.description);
    });

    it('should update only name', async () => {
      const updateDto = {
        name: 'Only Name Updated',
      };

      const response = await request(app.getHttpServer())
        .put(`/benefits/${createdBenefitId}`)
        .send(updateDto)
        .expect(200);

      const responseBody = response.body as UpdateBenefitResponse;
      expect(responseBody.name).toBe(updateDto.name);
    });

    it('should return 404 for non-existent benefit', async () => {
      const updateDto = {
        name: 'Updated Name',
      };

      const response = await request(app.getHttpServer())
        .put('/benefits/99999')
        .send(updateDto)
        .expect(404);

      const responseBody = response.body as ErrorResponse;
      expect(responseBody).toHaveProperty('statusCode', 404);
    });
  });

  describe('PUT /benefits/:id/activate', () => {
    beforeEach(async () => {
      // Create and deactivate a benefit for testing
      const createResponse = await request(app.getHttpServer())
        .post('/benefits')
        .send({
          name: 'Test Benefit for ACTIVATE',
          description: 'Created for ACTIVATE testing',
        });
      const createResponseBody = createResponse.body as CreateBenefitResponse;
      createdBenefitId = createResponseBody.id;

      // Deactivate it first
      await request(app.getHttpServer()).put(
        `/benefits/${createdBenefitId}/deactivate`,
      );
    });

    it('should activate a benefit', async () => {
      const response = await request(app.getHttpServer())
        .put(`/benefits/${createdBenefitId}/activate`)
        .expect(200);

      const responseBody = response.body as BenefitResponse;
      expect(responseBody).toHaveProperty('id', createdBenefitId);
      expect(responseBody.isActive).toBe(true);
    });

    it('should return 404 for non-existent benefit', async () => {
      const response = await request(app.getHttpServer())
        .put('/benefits/99999/activate')
        .expect(404);

      const responseBody = response.body as ErrorResponse;
      expect(responseBody).toHaveProperty('statusCode', 404);
    });
  });

  describe('PUT /benefits/:id/deactivate', () => {
    beforeEach(async () => {
      // Create a benefit for testing
      const createResponse = await request(app.getHttpServer())
        .post('/benefits')
        .send({
          name: 'Test Benefit for DEACTIVATE',
          description: 'Created for DEACTIVATE testing',
        });
      const createResponseBody = createResponse.body as CreateBenefitResponse;
      createdBenefitId = createResponseBody.id;
    });

    it('should deactivate a benefit', async () => {
      const response = await request(app.getHttpServer())
        .put(`/benefits/${createdBenefitId}/deactivate`)
        .expect(200);

      const responseBody = response.body as BenefitResponse;
      expect(responseBody).toHaveProperty('id', createdBenefitId);
      expect(responseBody.isActive).toBe(false);
    });

    it('should return 404 for non-existent benefit', async () => {
      const response = await request(app.getHttpServer())
        .put('/benefits/99999/deactivate')
        .expect(404);

      const responseBody = response.body as ErrorResponse;
      expect(responseBody).toHaveProperty('statusCode', 404);
    });
  });

  describe('DELETE /benefits/:id', () => {
    beforeEach(async () => {
      // Create a benefit for testing
      const createResponse = await request(app.getHttpServer())
        .post('/benefits')
        .send({
          name: 'Test Benefit for DELETE',
          description: 'Created for DELETE testing',
        });
      const createResponseBody = createResponse.body as CreateBenefitResponse;
      createdBenefitId = createResponseBody.id;
    });

    it('should delete a benefit successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/benefits/${createdBenefitId}`)
        .expect(204);

      // Verify the benefit is deleted
      await request(app.getHttpServer())
        .get(`/benefits/${createdBenefitId}`)
        .expect(404);
    });

    it('should return 404 for non-existent benefit', async () => {
      const response = await request(app.getHttpServer())
        .delete('/benefits/99999')
        .expect(404);

      const responseBody = response.body as ErrorResponse;
      expect(responseBody).toHaveProperty('statusCode', 404);
    });
  });

  describe('GET /metrics', () => {
    it('should return Prometheus metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/metrics')
        .expect(200);

      expect(response.text).toContain('# HELP');
      expect(response.text).toContain('# TYPE');
      expect(response.headers['content-type']).toContain('text/plain');
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger documentation', async () => {
      const response = await request(app.getHttpServer())
        .get('/api')
        .expect(200);

      expect(response.text).toContain('swagger');
    });
  });
});
