# set PATH so it includes go bin if it exists
if [ -d "/usr/local/go/bin" ] ; then
    PATH="/usr/local/go/bin:$PATH"
fi
# set PATH so it includes the the path to where a binary file compiled by the command "go install" is installed. 
if [ -n "`go env GOBIN`" ]; then
    PATH=`go env GOBIN`:$PATH
fi
if [ -n "`go env GOPATH`" ]; then
    PATH=`go env GOPATH`/bin:$PATH
elif [ -n "$HOME" ]; then
    PATH=$HOME/go/bin
fi

