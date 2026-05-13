// services/code.service.ts

import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { v4 as uuid } from 'uuid';


const execPromise = promisify(exec);

interface ExecuteCodeInput {
  code: string;
  language: 'python' | 'java' | 'cpp';
  input: string;
  expectedOutput: string;
}

const runProcess = (
  command: string,
  args: string[],
  input: string
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', () => {
      resolve({
        stdout,
        stderr,
      });
    });

    process.on('error', (err) => {
      reject(err);
    });

    // send stdin input
    process.stdin.write(input);
    process.stdin.end();
  });
};

export const executeCode = async ({
  code,
  language,
  input,
  expectedOutput,
}: ExecuteCodeInput) => {
  const jobId = uuid();

  const tempDir = path.join(process.cwd(), 'temp');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let fileName = '';
  let compileCommand = '';

  try {
    // =========================
    // PYTHON
    // =========================

    if (language === 'python') {
      fileName = `${jobId}.py`;

      const filePath = path.join(tempDir, fileName);

      fs.writeFileSync(filePath, code);

      const result = await runProcess(
        'python',
        [filePath],
        input
      );

      if (result.stderr) {
        return {
          passed: false,
          output: result.stderr,
          expectedOutput,
        };
      }

      const actualOutput = result.stdout.trim();

      return {
        passed: actualOutput === expectedOutput.trim(),
        output: actualOutput,
        expectedOutput: expectedOutput.trim(),
      };
    }

    // =========================
    // C++
    // =========================

    if (language === 'cpp') {
      fileName = `${jobId}.cpp`;

      const filePath = path.join(tempDir, fileName);

      const outputFile = path.join(tempDir, `${jobId}.exe`);

      fs.writeFileSync(filePath, code);

      compileCommand = `g++ "${filePath}" -o "${outputFile}"`;

      await execPromise(compileCommand);

      const result = await runProcess(
        outputFile,
        [],
        input
      );

      if (result.stderr) {
        return {
          passed: false,
          output: result.stderr,
          expectedOutput,
        };
      }

      const actualOutput = result.stdout.trim();

      return {
        passed: actualOutput === expectedOutput.trim(),
        output: actualOutput,
        expectedOutput: expectedOutput.trim(),
      };
    }

    // =========================
    // JAVA
    // =========================

    if (language === 'java') {
      const folderPath = path.join(tempDir, jobId);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fileName = 'Main.java';

      const filePath = path.join(folderPath, fileName);

      fs.writeFileSync(filePath, code);

      compileCommand = `javac "${filePath}"`;

      await execPromise(compileCommand);

      const result = await runProcess(
        'java',
        ['-cp', folderPath, 'Main'],
        input
      );

      if (result.stderr) {
        return {
          passed: false,
          output: result.stderr,
          expectedOutput,
        };
      }

      const actualOutput = result.stdout.trim();

      return {
        passed: actualOutput === expectedOutput.trim(),
        output: actualOutput,
        expectedOutput: expectedOutput.trim(),
      };
    }

    return {
      passed: false,
      output: 'Unsupported language',
      expectedOutput,
    };
  } catch (err: any) {
    return {
      passed: false,
      output: err.message || 'Execution failed',
      expectedOutput,
    };
  }
};