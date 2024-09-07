# Claim_Requests_REACT_09

## Table of contents
- [Getting started](#getting-started)
- [Working on this repository](#working-on-this-repository)
  - [Fetching and Committing](#fetching-and-committing)
  - [Configuring Environment Variables (.env)](#configuring-environment-variables-env)
  - [Switching roles for different teams](#switching-roles-for-different-teams)
- [Alternate push method](#alternate-push-method)

## Getting started

First you need to clone this repository by opening up your terminal in the desired directory (e.g. `C:/myFiles`) and execute the following command:  
```bash
git clone http://git.fa.edu.vn/hcm24_cpl_react_09/claim_requests_react_09.git  
```
The project files should now be located in `C:/myFiles/claim_requests_react_09`.  

Then you have to install the dependencies for the repository:  
```bash
cd claim_requests_react_09  
npm i  
# Or if you're using Visual Studio Code,  
# Just open up the terminal at the root of the project then run this command.  
npm i  
```

After that, all you have to do is run this command to start developing!  
```bash
npm run dev
```

## Working on this repository
### Fetching and Committing
Don't forget to **fetch** or **pull** the new changes if your branch is not up-to-date!  
```bash
# If you're missing new files.
# OR
# If you have already created some local commits,
# But your branch is some commits behind main.
git pull --rebase origin main
```

```bash
# Else if you already made changes to the code,
# BUT you haven't committed the code,
git stash
# To stash the changes

git pull --rebase origin main
# Pull the main branch

git stash pop
# To reapply your changes
```

If you have finished implementing + testing a new feature, here's how you can create a commit and a merge request to the main branch:  

```bash
git checkout -b your_branch_name
# Note that the branch name can be anything you want,
# But it is recommended to name it after the feature you're adding.  
# Examples: add-login-button, claimer/add-pending-page  

git add .
git commit -m "Your commit message"
# The commit message can be anything you want but keep it short.  
# Examples: Add login button, Add Pending page for Claimers  

git push origin your_branch_name
```
After pushing to the branch, don't forget to go to the [FSA GitLabs repository](https://git.fa.edu.vn/hcm24_cpl_react_09/claim_requests_react_09) page to create a new Merge Request.  

### Configuring Environment Variables (.env)  
This project requires some **secret** API links to be stored in a `.env` file in order to perform operations inside the Redux reducers.  

You **must** follow these steps to ensure the project works on your local machine:
1. Create a file named `.env` in the **ROOT** of your project directory (`C:/myFiles/claim_requests_react_09`).  
2. *(Optional)* Locate the `.env.example` in the same path and copy the variables' **names** to the `.env`.  
```bash
# The variables should look like this.
VITE_PROJECTS_CLAIMS_API="https://provided.api/url"
VITE_STAFF_API="https://provided.api/url"
VITE_JWT_SECRET="Provided-key"
```
3. Copy the secrets (API links) provided by one of the maintainers of the project.  

### Switching roles for different teams
Can't find the right Sidebar settings for your team, whether you're Claimer, Approver, Finance and not Admin?  

Follow these steps to start working right away!  
1. Locate and open `src/components/NavLinks.tsx`.  
2. Look for this code snippet:  
```tsx
// Found near the top of the code.
useEffect(() => {
    const links = getNavLinks("admin");
    setNavLinks(links);
  }, []);
```
3. Switch `"admin"` with your role (lowercase), like: "claimer", "approver", "finance".  
4. Save and you're done!  

## Alternate push method

Don't forget to **fetch** or **pull** the new changes if your branch is not up-to-date!  
```bash
# If you're missing new files.
# OR
# If you have already created some local commits,
# But your branch is some commits behind main.
git pull --rebase origin main
```

```bash
# Else if you already made changes to the code,
# BUT you haven't committed the code,
git stash
# To stash the changes

git pull --rebase origin main
# Pull the main branch

git stash pop
# To reapply your changes
```

You can also do this in the `Source Control` tab in **VS Code**, which can be a little confusing.  

First, create a new branch by selecting the `...` button at the top:  
- You can select `Checkout to...` > `Create a new branch` > Input branch name.
- Alternatively, you can select `Branch` > `Create branch...` > Input branch name > `Checkout to...` > Select branch.  

Don't forget to check the `Outgoing` section under `Changes` to know if **you're on the right branch**!  

Then, you have to **stage** the files for commit by pressing the `+` button that appears next to the desired files in the `Changes` section.  

Once you're done staging, write a **Commit Message** in the textbox at the top of the `Source Control` tab.  
Don't forget to check the `Outgoing` section under `Changes` to know if **you're on the right branch**!  

Next to the `Commit` button, select the **arrow down** button and pick `Commit & Push`.  
