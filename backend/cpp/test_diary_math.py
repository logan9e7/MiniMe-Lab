"""Compile and verify the C++17 engine with Python stdlib only."""
import json
import pathlib
import shutil
import subprocess
import tempfile
import unittest

SOURCE = pathlib.Path(__file__).with_name("diary_math.cpp")

@unittest.skipUnless(shutil.which("g++"), "g++ not installed")
class DiaryMathTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.exe = pathlib.Path(cls.tmp.name) / "diary_math"
        subprocess.run(["g++", "-std=c++17", "-O2", "-Wall", "-Wextra", str(SOURCE), "-o", str(cls.exe)], check=True)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def run_engine(self, data):
        return subprocess.run([str(self.exe)], input=data, text=True, capture_output=True)

    def test_leap_year_and_statistics(self):
        r = self.run_engine("2024-01-31 2024-02-29 2024-03-30")
        self.assertEqual(r.returncode, 0, r.stderr)
        result = json.loads(r.stdout)
        self.assertEqual(result["intervals"], [29, 30])
        self.assertEqual(result["mean"], 29.5)
        self.assertAlmostEqual(result["sd"], 0.7071, places=4)

    def test_duplicate_and_invalid(self):
        self.assertEqual(json.loads(self.run_engine("2026-01-01 2026-01-01").stdout)["count"], 0)
        self.assertNotEqual(self.run_engine("2025-02-29").returncode, 0)

    def test_excluded_interval(self):
        result = json.loads(self.run_engine("2026-01-01 2026-01-10").stdout)
        self.assertEqual(result["excluded"], 1)
        self.assertIsNone(result["mean"])

if __name__ == "__main__":
    unittest.main()
