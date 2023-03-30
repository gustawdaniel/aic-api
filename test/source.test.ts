import { getFastifyServer } from '../src/fastify';
import { prisma } from '../src/storage/prisma';
import { FastifyInstance, FastifyRequest } from "fastify";
import {  SourceType } from "@prisma/client";
import { tokenizeUser } from "../src/functions/auth";

// Mock data
const testUser = {
  id: '1',
  email: 'test@example.com',
  roles: []
};

// Helper function to mock user authentication
const auth = async (req: FastifyRequest) => {
  req.user = testUser;
};

describe('Source endpoints', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await getFastifyServer();
    server.decorateRequest('user', null);
    server.addHook('preValidation', auth);
  });

  // afterAll(() => {
  //   server.close();
  // });
  //
  // afterEach(() => {
  //   jest.restoreAllMocks();
  // });

  it('GET /source should return a list of sources', async () => {
    const expectedResult = [
      {
        id: '1',
        user_id: testUser.id,
        url: 'https://businessinsider.com.pl/gospodarka.feed\t',
        type: SourceType.buisnesinsider,
        _count: {requests: 1},
      },
    ];

    jest.spyOn(prisma.sources, 'findMany').mockResolvedValue(expectedResult);

    const response = await server.inject({
      method: 'GET',
      path: '/source',
      headers: {
        Authorization: `Bearer ${ tokenizeUser(testUser) }`
      }
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(expectedResult);
    expect(prisma.sources.findMany).toHaveBeenCalledWith({
      where: {
        user_id: testUser.id,
      },
      include: {
        _count: {
          select: {
            requests: true,
          },
        },
      },
    });

  });

  it('POST /source should create a new source', async () => {
    const requestBody = {
      url: 'https://businessinsider.com.pl/gospodarka.feed',
    };
    const expectedResult = {
      id: '1',
      user_id: testUser.id,
      url: 'https://businessinsider.com.pl/gospodarka.feed',
      type: SourceType.buisnesinsider,
    };

    jest.spyOn(prisma.sources, 'create').mockResolvedValue(expectedResult);

    const response = await server.inject({
      method: 'POST',
      path: '/source',
      payload: requestBody,
      headers: {
        Authorization: `Bearer ${ tokenizeUser(testUser) }`
      }
    });
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(expectedResult);
    expect(prisma.sources.create).toHaveBeenCalledWith({
      data: {
        user_id: testUser.id,
        url: requestBody.url,
        type: SourceType.buisnesinsider
      },
    });
  });

  it('DELETE /source/:id should delete a source', async () => {
    const sourceId = '1';
    const expectedResult = {count: 1};

    jest.spyOn(prisma.sources, 'deleteMany').mockResolvedValue(expectedResult);

    const response = await server.inject({
      method: 'DELETE',
      path: `/source/${ sourceId }`,
      headers: {
        Authorization: `Bearer ${ tokenizeUser(testUser) }`
      }
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(expectedResult);
    expect(prisma.sources.deleteMany).toHaveBeenCalledWith({
      where: {
        id: sourceId,
        user_id: testUser.id,
      },
    });

  });

  it('should return an error if no source is found', async () => {
    const sourceId = '2';
    const expectedResult = {count: 0};

    jest.spyOn(prisma.sources, 'deleteMany').mockResolvedValue(expectedResult);

    const response = await server.inject({
      method: 'DELETE',
      path: `/source/${ sourceId }`,
      headers: {
        Authorization: `Bearer ${ tokenizeUser(testUser) }`
      }
    });

    expect(response.statusCode).toEqual(404); // or other error code based on your implementation
    expect(JSON.parse(response.body)).toEqual({
      "error": "Not Found",
      "message": "Not Found",
      "statusCode": 404,
    }); // or other error message based on your implementation
    expect(prisma.sources.deleteMany).toHaveBeenCalledWith({
      where: {
        id: sourceId,
        user_id: testUser.id,
      },
    });
  });
});
