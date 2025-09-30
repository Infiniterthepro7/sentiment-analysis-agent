"""
Setup script for additional Python dependencies if needed for advanced audio processing
This script can be run to install additional audio processing libraries
"""

import subprocess
import sys

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Audio processing libraries that might be useful for advanced features
packages = [
    "librosa",  # Audio analysis
    "soundfile",  # Audio file I/O
    "numpy",  # Numerical operations
    "matplotlib",  # Plotting (if server-side charts needed)
    "scipy"  # Scientific computing
]

print("Installing audio processing dependencies...")
for package in packages:
    try:
        install_package(package)
        print(f"✓ Installed {package}")
    except Exception as e:
        print(f"✗ Failed to install {package}: {e}")

print("Setup complete!")
