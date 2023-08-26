import { describe, it, expect } from 'vitest';
import { GithubUrl, asGithubRawUrl, isGithubRawUrl, isGithubUrl } from './github-url';

describe('github-url', () => {
  describe('isGithubUrl', () => {
    it('should return true for github urls', () => {
      expect(isGithubUrl('https://github.com/cyvaer-llc/learn-viewer')).toBe(true);
      expect(isGithubUrl('https://github.com/')).toBe(true);
    });

    it('should return false for non-github urls', () => {
      expect(isGithubUrl('https://google.com')).toBe(false);
    });

    it('should throw an error for invalid urls', () => {
      expect(() => isGithubUrl('github.com')).toThrow();
    });
  });

  describe('isGithubRawUrl', () => {
    it('should return true for github raw urls', () => {
      expect(isGithubRawUrl('https://raw.githubusercontent.com/cyvaer-llc/learn-viewer/main/README.md')).toBe(true);
    });

    it('should return false for non-github raw urls', () => {
      expect(isGithubRawUrl('https://google.com')).toBe(false);
    });

    it('should throw an error for invalid urls', () => {
      expect(() => isGithubRawUrl('raw.githubusercontent.com')).toThrow();
    });
  });

  describe('GithubUrl', () => {
    const testVec = [
      ['https://github.com/cyvaer-llc/core/blob/master/c19/seattle/course.yaml', 'cyvaer-llc', 'core', 'master', 'c19/seattle/course.yaml'],
      ['https://github.com/cyvaer-llc/core/blob/master/c19/', 'cyvaer-llc', 'core', 'master', 'c19/'],
      ['https://github.com/cyvaer-llc/core/blob/master/c19', 'cyvaer-llc', 'core', 'master', 'c19'],
      ['https://github.com/cyvaer-llc/core/blob/master/', 'cyvaer-llc', 'core', 'master', ''],
      ['https://github.com/cyvaer-llc/core/blob/master', 'cyvaer-llc', 'core', 'master', ''],
      ['https://github.com/cyvaer-llc/core/blob/ma-ster', 'cyvaer-llc', 'core', 'ma-ster', ''],
      ['https://github.com/cyvaer-llc/co-re/blob/ma-ster', 'cyvaer-llc', 'co-re', 'ma-ster', ''],
      ['https://github.com/cyvaer-llc/core/', 'cyvaer-llc', 'core', 'main', ''],
      ['https://github.com/cyvaer-llc/core', 'cyvaer-llc', 'core', 'main', ''],
    ];

    it.each(testVec)('should turn %s into owner %s, repo %s, branch %s, and path %s', (urlstr, owner, repo, branch, path) => {
      const url = new GithubUrl(urlstr);
      expect(url.owner).toBe(owner);
      expect(url.repo).toBe(repo);
      expect(url.branch).toBe(branch);
      expect(url.path).toBe(path);
    });

    const invalidUrls = [
      ['https://github.com/cyvaer-llc'],
      ['https://github.com/cyvaer-llc/'],
      ['https://github.com/cvaer-llc/core/blob'],
      ['https://github.com/cvaer-llc/core/blob/'],
      ['https://github.com/cvaer-llc/co-re/blob/']
    ];

    it.each(invalidUrls)('should throw an error for invalid url %s', (urlstr) => {
      expect(() => new GithubUrl(urlstr)).toThrow();
    });
  });

  // describe('asGithubRawUrl', () => {
  //   // it('should convert github urls to github raw urls', () => {
  //   //   expect(
  //   //     asGithubRawUrl('https://github.com/Ada-Developers-Academy/core/blob/main/c19/seattle/course.yaml')
  //   //   ).toBe('https://raw.githubusercontent.com/Ada-Developers-Academy/core/main/c19/seattle/course.yaml');
  //   // });
  // });
});