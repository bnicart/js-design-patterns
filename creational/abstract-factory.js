/**
 * Abstract Factory (creational)
 * Create families of related objects without naming their concrete classes, so the parts always match.
 *
 * Modern JS: there are no interfaces, so the "abstract" factory is just an
 * agreed shape. Any object with the right methods works, which means a plain
 * object literal of functions is often enough.
 */

// Two families of storage parts. Mixing them (an S3 uploader with a local URL
// builder) would produce broken links, which is the bug this pattern prevents.
export class LocalUploader {
  upload(name) {
    return `/var/uploads/${name}`;
  }
}

export class LocalUrls {
  urlFor(name) {
    return `http://localhost:3000/uploads/${name}`;
  }
}

export class CloudUploader {
  upload(name) {
    return `s3://app-bucket/${name}`;
  }
}

export class CloudUrls {
  urlFor(name) {
    return `https://cdn.example.com/${name}`;
  }
}

export class LocalStorageFactory {
  createUploader() {
    return new LocalUploader();
  }

  createUrls() {
    return new LocalUrls();
  }
}

export class CloudStorageFactory {
  createUploader() {
    return new CloudUploader();
  }

  createUrls() {
    return new CloudUrls();
  }
}

// Client code only knows the factory's shape, never the concrete classes.
export function saveAvatar(factory, name) {
  const path = factory.createUploader().upload(name);
  return { path, url: factory.createUrls().urlFor(name) };
}

export const storageFor = (env) =>
  env === 'production' ? new CloudStorageFactory() : new LocalStorageFactory();
