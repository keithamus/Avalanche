FOR="production"
QUIET=false

dev: FOR = "development"

all: tests clean submodules css resources html js
	@@if ! ${QUIET}; then echo "Done"; fi

dev: all

submodules:
	@@if ! ${QUIET}; then echo "Updating Git submodules..."; fi
	@@git submodule init && git submodule update

css: clean
	@@if ! ${QUIET}; then echo "Compiling CSS code for ${FOR}..."; fi
	@@if ! ${QUIET}; then ARGS=""; else ARGS="q"; fi; \
	compass compile -$${ARGS}e ${FOR} stylesheets/application.scss stylesheets/themes/*

js:
	@@if ! ${QUIET}; then echo "Compressing code..."; fi
	@@cp -r javascripts build/
	
resources: 
	@@if ! ${QUIET}; then echo "Compressing images..."; fi
	@@cp -r themes_res build/themes/res

html:
	@@if ! ${QUIET}; then echo "Compressing HTML..."; fi
	@@cp index.html build/
	
tests:
	@@if ! ${QUIET}; then echo "Running tests..."; fi

clean:
	@@rm -rf build/*
	@@if ! ${QUIET}; then echo "Cleaned build directory."; fi

watch:
	@@if ! ${QUIET}; then echo "Watching directory for changes..."; fi
	@@inotifywait -qmr -e close_write,move_self,create --format '%f' --exclude '(build*|.scssc)' . | while read FILE; do \
		echo "Compiling because of a change found to $${FILE}"; \
		$(MAKE) clean css resources html js QUIET=true -s; \
	done;