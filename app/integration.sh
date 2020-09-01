#!/bin/bash

pids=( )

# define cleanup function
cleanup() {
	printf "\nCleaning up...\n"
	for pid in "${pids[@]}"; do
		kill -0 "$pid" && kill "$pid" # kill process only if it's still running
	done

	exit 0
}
# and set that function to run before we exit, or specifically when we get a SIGTERM
trap cleanup EXIT TERM

if [[ $* != *--no-dev-server* ]]; then
	printf "Starting the dev server...\n"
	webpack-dev-server --hot --inline --config app/webpack.config.js & SERVER_PID=$! pids+=( "$SERVER_PID" )
	sleep 10
	printf "Server process ID: $SERVER_PID\n"
fi


printf "Finding tests...\n"
FILES=app/tests/*
for f in $FILES
do
	# run each file
	node $f & TEST_PID=$!
	printf "Testing $f (PID: $TEST_PID)...\n"
	if [[ $* != *--sync* ]]; then
		pids+=( "$TEST_PID" )
	else
		wait $TEST_PID
		printf "Test $f (PID: $TEST_PID) completed.\n"
	fi
done

if [[ $* != *--sync* ]]; then
	for pid in "${pids[@]}"; do
		if [ $pid != $SERVER_PID ]; then
			printf "Waiting for test process at '$pid' to exit...\n"
			wait $pid
			printf "\nTest running at '$pid' completed\n"
		fi
	done
fi

if [[ $* != *--no-dev-server* ]]; then
	printf "The Dev Server (PID: $SERVER_PID) is still running, press Ctrl+C to exit.\n"
	wait $SERVER_PID
fi