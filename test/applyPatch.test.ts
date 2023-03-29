import { applyPatch } from "rfc6902";

describe('applyPatch', () => {

  it('replace', () => {
    const state = {
      state: 'old'
    };
    const res = applyPatch(state, [
      {
        // @ts-ignore
        from: null,
        op: 'replace',
        path: '/state',
        value: 'new'
      }
    ]);

    expect(state).toStrictEqual({state: 'new'})
    expect(res).toStrictEqual([null])
  })

  it('for document', () => {
    const state = {
      state: 'new',
      components: [{xpath: [Array], text: 'hello world', finish_reason: 'stop'}],
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    };
    const checkout = applyPatch(state, [
      {
        // @ts-ignore
        from: null,
        op: 'replace',
        path: '/components/0/text',
        value: 'hello'
      }
    ]);

    expect(state).toStrictEqual({
      state: 'new',
      components: [{xpath: [Array], text: 'hello', finish_reason: 'stop'}],
      request_id: null,
      user_id: '61cf1af0c4ca4238a0b92382'
    });
    expect(checkout).toStrictEqual([null])
  })

})
