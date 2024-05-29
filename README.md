# Web Scraping with Beautiful Soup and Selenium

```## Overview

This example contains scripts and instructions for scraping dynamic websites using Beautiful Soup (Bs4) and Selenium. The scraping process is demonstrated using the Hornbacher's website as an example.

## Prerequisites

### Cygwin64 Terminal Installation

1. **Install Cygwin64 Terminal**: Download and install Cygwin64 Terminal from [here](https://www.cygwin.com/setup-x86_64.exe).
2. **Select All Packages**: During installation, select all packages for installation.
3. **Complete Installation**: Once you've installed your desired subset of the Cygwin distribution, the setup program will remember what you selected. You can re-run it to update your system with any new package releases.
4. **For Further Queries**: For any other queries, refer to the official website [here](https://www.cygwin.com/install.html).

### Geckodriver Installation

1. **Download GeckoDriver**: Obtain the Geckodriver from [here](https://github.com/mozilla/geckodriver/releases/download/v0.34.0/geckodriver-v0.34.0-win64.zip).
2. **Uzip**: Once downloaded, unzip the `geckodriver.exe` file and place it in your preferred directory. 
3. **Example path**: `D:\drivers\geckodriver.exe`


## Usage

### Merchant Details - Hornbacher's

1. **Add Merchant Details**: Start by adding the merchant details in the `brands_config_selenium.yml` file and save it.
2. **Create Bash Script**: Create a bash script file named `bash-hornbachers.sh` in the root folder.
3. **Create Python Script**: Next, create a `main.py` file in the `/brands_scraper/scraper_scripts/hornbachers` path.

### Required Changes in `main.py`

1. **Update the GeckoDriver path**: Locate the line `geckodriver_path = r"D:\WebScrap\geckodriver.exe"`.
2. **Replace with your path**: Change this to the path where you saved your `geckodriver.exe`.

### Rquired Changes in `bash-hornbachers.sh`

1. **For Windows**: Locate the line and uncomment `source venv/Scripts/activate`
2. **For Linux/Mac**: `source venv/bin/activate` (currently under development).
3. **Pip Install**: Ensure you only install the libraries used in `main.py`. For example, `pip install selenium beautifulsoup4 pyyaml pandas requests`.

### How to Run the script?

1. Open the Cygwin64 Terminal and navigate to the repository folder.
2. Make the `bash-hornbachers.sh` script executable by running the command `chmod +x bash-hornbachers.sh`
3. Run the script by executing `./bash-hornbachers.sh`
4. Check the logs in the `/scraper/logs` directory for any output or errors.
5. View the scraped data in the `/scraper/raw_output` directory.
```
