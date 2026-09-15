import { FullNamePipe } from './full-name.pipe';

describe('FullNamePipe', () => {
  const pipe = new FullNamePipe();

  it('joins first and last name', () => {
    expect(pipe.transform({ firstName: 'Rahul', lastName: 'Sharma' } as never)).toBe('Rahul Sharma');
  });

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
