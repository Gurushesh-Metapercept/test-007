# PWC-AssuranceAssist-Localization  

## Installation Guide  

### Prerequisites  
Before setting up the project, ensure you have the following installed on your system:  

- **Node.js** (v20.11.0)  

---

## Project Setup  

### 1. Clone the Repository  
Download or clone the repository from GitHub:  

```sh
git clone https://github.com/neteffsol/com.pwc.viewpoint.validation-scripts-IASB-AICPA-CPA/tree/assuranceAssist-localization
```  

### 2. Install Dependencies  
Run the following command to install the required dependencies:  

```sh
npm install
```  

### 3. Prerequisites  

1. **Create an `input` folder** in the root directory of the project. Store your input files in this folder.  
   - These files **must** contain `<p>` tags with `conaction` and `conref` attributes.  
   - When the script runs, it extracts details from these `<p>` tags and stores them in `dataset.json`.  

2. **Create a `source` folder** in the root directory of the project.  
   - Store files here that require updates to `<p>` tags.  

### 4. Start the Script  
To run the script, execute:  

```sh
node index.js
```  

---

Once the script starts, it will read all the data from the input files and store it in the `dataset.json` file.  

