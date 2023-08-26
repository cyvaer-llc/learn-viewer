import { describe, it, expect } from 'vitest';
import { GithubUrl } from './github-url';

describe('GithubUrl', () => {
  const testVec = [
    ['https://github.com/cyvaer-llc/core/blob/master/c19/seattle/course.yaml', 'cyvaer-llc', 'core', 'master', '/c19/seattle/course.yaml'],
    ['https://github.com/cyvaer-llc/core/blob/master/c19/', 'cyvaer-llc', 'core', 'master', '/c19/'],
    ['https://github.com/cyvaer-llc/core/blob/master/c19', 'cyvaer-llc', 'core', 'master', '/c19'],
    ['https://github.com/cyvaer-llc/core/blob/master/', 'cyvaer-llc', 'core', 'master', '/'],
    ['https://github.com/cyvaer-llc/core/blob/master', 'cyvaer-llc', 'core', 'master', '/'],
    ['https://github.com/cyvaer-llc/core/blob/ma-ster', 'cyvaer-llc', 'core', 'ma-ster', '/'],
    ['https://github.com/cyvaer-llc/co-re/blob/ma-ster', 'cyvaer-llc', 'co-re', 'ma-ster', '/'],
    ['https://github.com/cyvaer-llc/core/', 'cyvaer-llc', 'core', 'main', '/'],
    ['https://github.com/cyvaer-llc/core', 'cyvaer-llc', 'core', 'main', '/'],

    ['https://raw.githubusercontent.com/cyvaer-llc/core/master/c19/seattle/course.yaml', 'cyvaer-llc', 'core', 'master', '/c19/seattle/course.yaml'],
    ['https://raw.githubusercontent.com/cyvaer-llc/core/master/c19/', 'cyvaer-llc', 'core', 'master', '/c19/'],
    ['https://raw.githubusercontent.com/cyvaer-llc/core/master/c19', 'cyvaer-llc', 'core', 'master', '/c19'],
    ['https://raw.githubusercontent.com/cyvaer-llc/core/master/', 'cyvaer-llc', 'core', 'master', '/'],
    ['https://raw.githubusercontent.com/cyvaer-llc/core/master', 'cyvaer-llc', 'core', 'master', '/'],
    ['https://raw.githubusercontent.com/cyvaer-llc/core/ma-ster', 'cyvaer-llc', 'core', 'ma-ster', '/'],
    ['https://raw.githubusercontent.com/cyvaer-llc/co-re/ma-ster', 'cyvaer-llc', 'co-re', 'ma-ster', '/']
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
    ['https://github.com/cvaer-llc/co-re/blob/'],
    ['/cyvaer-llc/core/'],
    ['/cyvaer-llc/core'],
  ];

  it.each(invalidUrls)('should throw an error for invalid url %s', (urlstr) => {
    expect(() => new GithubUrl(urlstr)).toThrow();
  });

  it('should convert github urls to github raw urls', () => {
    const url = new GithubUrl('https://github.com/cyvaer-llc/core/blob/master/c19/seattle/course.yaml');
    expect(url.courseYamlUrl()).toBe('https://raw.githubusercontent.com/cyvaer-llc/core/master/c19/seattle/course.yaml');
  });

  it('should convert github urls to github raw urls, supplying course.yaml', () => {
    const url2 = new GithubUrl('https://github.com/cyvaer-llc/core/blob/master/c19/seattle');
    expect(url2.courseYamlUrl()).toBe('https://raw.githubusercontent.com/cyvaer-llc/core/master/c19/seattle/course.yaml');
  });

  it('should convert github urls to github raw urls, supplying course.yaml and handling trailing slash', () => {
    const url = new GithubUrl('https://github.com/cyvaer-llc/core/blob/master/c19/seattle/');
    expect(url.courseYamlUrl()).toBe('https://raw.githubusercontent.com/cyvaer-llc/core/master/c19/seattle/course.yaml');
  });

  it('should convert github urls at the root into github raw urls', () => {
    const url = new GithubUrl('https://github.com/cyvaer-llc/core');
    expect(url.courseYamlUrl()).toBe('https://raw.githubusercontent.com/cyvaer-llc/core/main/course.yaml');
  });

  it('should produce the same raw URL if it is already to a course.yaml', () => {
    const course = 'https://raw.githubusercontent.com/cyvaer-llc/core/main/course.yaml';
    const url = new GithubUrl(course);
    expect(url.courseYamlUrl()).toBe(course);
  });

  it('should add course.yaml to a raw root that only refers to the branch', () => {
    const url = new GithubUrl('https://raw.githubusercontent.com/cyvaer-llc/core/main');
    expect(url.courseYamlUrl()).toBe('https://raw.githubusercontent.com/cyvaer-llc/core/main/course.yaml');
  });

  it('should add course.yaml to a raw root that only refers to the branch, handling trailing slash', () => {
    const url = new GithubUrl('https://raw.githubusercontent.com/cyvaer-llc/core/main/');
    expect(url.courseYamlUrl()).toBe('https://raw.githubusercontent.com/cyvaer-llc/core/main/course.yaml');
  });

  it('should convert raw urls to github urls', () => {
    const url = new GithubUrl('https://raw.githubusercontent.com/cyvaer-llc/core/master/c19/seattle/course.yaml');
    expect(url.githubUrl()).toBe('https://github.com/cyvaer-llc/core/blob/master/c19/seattle/course.yaml');
  });

  it('should convert raw urls to github urls', () => {
    const url = new GithubUrl('https://raw.githubusercontent.com/cyvaer-llc/core/master/course.yaml');
    expect(url.githubUrl()).toBe('https://github.com/cyvaer-llc/core/blob/master/course.yaml');
  });
});