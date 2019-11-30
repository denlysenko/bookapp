import { TestBed } from '@angular/core/testing';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { LAST_LOGS_QUERY, LOGS_QUERY } from '@bookapp/shared';
import { book, log } from '@bookapp/testing';

import {
  APOLLO_TESTING_CACHE,
  ApolloTestingController,
  ApolloTestingModule
} from 'apollo-angular/testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { addTypenameToDocument } from 'apollo-utilities';

import { DEFAULT_ORDER_BY, LogsService } from './logs.service';

describe('LogsService', () => {
  let controller: ApolloTestingController;
  let service: LogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        LogsService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({ addTypename: true })
        }
      ]
    });

    controller = TestBed.get(ApolloTestingController);
    service = TestBed.get(LogsService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLastLogs()', () => {
    it('should get last logs', done => {
      service.getLastLogs().valueChanges.subscribe(({ data: { logs: { rows } } }) => {
        const [l] = rows;
        expect(l.action).toEqual(log.action);
        done();
      });

      controller.expectOne(addTypenameToDocument(LAST_LOGS_QUERY)).flush({
        data: {
          logs: {
            rows: [
              {
                action: log.action,
                createdAt: log.createdAt,
                __typename: 'Log',
                book: {
                  title: book.title,
                  author: book.author,
                  __typename: 'Book'
                }
              }
            ],
            __typename: 'LogsResponse'
          }
        }
      });

      controller.verify();
    });
  });

  describe('getLogs()', () => {
    it('should get logs', done => {
      service
        .getLogs()
        // tslint:disable-next-line: no-identical-functions
        .valueChanges.subscribe(({ data: { logs: { rows } } }) => {
          const [l] = rows;
          expect(l.action).toEqual(log.action);
          done();
        });

      const op = controller.expectOne(addTypenameToDocument(LOGS_QUERY));

      expect(op.operation.variables.first).toEqual(DEFAULT_LIMIT);
      expect(op.operation.variables.orderBy).toEqual(DEFAULT_ORDER_BY);

      op.flush({
        data: {
          logs: {
            rows: [
              {
                action: log.action,
                createdAt: log.createdAt,
                __typename: 'Log',
                book: {
                  _id: book._id,
                  title: book.title,
                  author: book.author,
                  url: book.url,
                  paid: book.paid,
                  __typename: 'Book'
                }
              }
            ],
            count: 1,
            __typename: 'LogsResponse'
          }
        }
      });

      controller.verify();
    });
  });
});
