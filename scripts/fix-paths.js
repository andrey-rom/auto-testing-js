import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, relative } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

function fixPathsInJson(filePath) {
  if (!existsSync(filePath)) {
    return;
  }
  
  try {
    const content = readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    function convertPath(path) {
      if (typeof path === 'string') {
        if (path.startsWith('/') && path.includes(projectRoot)) {
          return relative(projectRoot, path);
        }
        if (path.startsWith('C:\\') || path.startsWith('D:\\')) {
          const normalized = path.replace(/\\/g, '/');
          if (normalized.includes(projectRoot.replace(/\\/g, '/'))) {
            return relative(projectRoot, path.replace(/\\/g, '/'));
          }
        }
      }
      return path;
    }
    
    function processObject(obj) {
      if (Array.isArray(obj)) {
        return obj.map(item => processObject(item));
      } else if (obj !== null && typeof obj === 'object') {
        const processed = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'path' || key === 'configFile' || key === 'rootDir' || key === 'testDir' || key === 'outputDir' || key === 'file') {
            processed[key] = convertPath(value);
          } else {
            processed[key] = processObject(value);
          }
        }
        return processed;
      }
      return obj;
    }
    
    const fixed = processObject(data);
    writeFileSync(filePath, JSON.stringify(fixed, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

const jsonFile = resolve(projectRoot, 'test-results.json');
fixPathsInJson(jsonFile);

