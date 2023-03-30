import { createLinkHeader } from "../src/functions/createLinkHeader";

describe('createLinkHeader', () => {
  it('empty', () => {
    expect(createLinkHeader('test.com', 0,10, 0)).toStrictEqual('')
  });

  it('i am on first page', () => {
    expect(createLinkHeader('test.com', 1,10, 100)).toStrictEqual('<test.com?page=2&limit=10>; rel="next", <test.com?page=10&limit=10>; rel="last"')
  })

  it('i am on second page', () => {
    expect(createLinkHeader('test.com', 2,10, 100)).toStrictEqual('<test.com?page=1&limit=10>; rel="prev", <test.com?page=3&limit=10>; rel="next", <test.com?page=10&limit=10>; rel="last"')
  })

  it('i am on third page', () => {
    expect(createLinkHeader('test.com', 3,10, 100)).toStrictEqual('<test.com?page=1&limit=10>; rel="first", <test.com?page=2&limit=10>; rel="prev", <test.com?page=4&limit=10>; rel="next", <test.com?page=10&limit=10>; rel="last"')
  })

  it('i am on 2 before last page', () => {
    expect(createLinkHeader('test.com', 8,10, 100)).toStrictEqual('<test.com?page=1&limit=10>; rel="first", <test.com?page=7&limit=10>; rel="prev", <test.com?page=9&limit=10>; rel="next", <test.com?page=10&limit=10>; rel="last"')
  })

  it('i am on before last page', () => {
    expect(createLinkHeader('test.com', 9,10, 100)).toStrictEqual('<test.com?page=1&limit=10>; rel="first", <test.com?page=8&limit=10>; rel="prev", <test.com?page=10&limit=10>; rel="next"')
  })

  it('i am on last page', () => {
    expect(createLinkHeader('test.com', 10,10, 100)).toStrictEqual('<test.com?page=1&limit=10>; rel="first", <test.com?page=9&limit=10>; rel="prev"')
  })
})
