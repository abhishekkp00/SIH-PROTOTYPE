const { spawn } = require('child_process');

function runPython(modulePath, payload) {
  return new Promise((resolve, reject) => {
    const py = spawn(process.env.PYTHON_BIN || 'python', [modulePath]);
    let out = '';
    let err = '';
    py.stdout.on('data', (d) => (out += d.toString()));
    py.stderr.on('data', (d) => (err += d.toString()));
    py.on('close', (code) => {
      if (code !== 0) return reject(new Error(`Python exited with ${code}: ${err}`));
      try {
        resolve(JSON.parse(out));
      } catch (e) {
        reject(new Error('Invalid JSON from Python: ' + out));
      }
    });
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}

module.exports = { runPython };