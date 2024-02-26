To remove the node_modules folder from Git, follow those simple steps:

1. Create a .gitignore file with this entry.

node_modules 2. Remove the node_modules folder from the Git index using the git rm cached command.

git rm -r --cached node_modules 3. Commit the changes.

git commit -am "removed node_modules folder" 4. Push the changes to the remote.

git push origin master
