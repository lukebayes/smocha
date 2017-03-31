BASEDIR="$( cd $( dirname "${(%):-%N}" ) && pwd )"

MODULEDIR="$BASEDIR/node_modules/.bin"
# Add local node module binaries to the end of the path.
export PATH="$PATH:$MODULEDIR"
echo "Added $MODULEDIR to \$PATH"

