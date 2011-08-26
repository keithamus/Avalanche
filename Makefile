for?="production"

all: tests clean submodules css html js

submodules:
	@@echo "Updating Git submodules..."
	@@git submodule init && git submodule update

css: clean
	@@echo "Compiling CSS code for $(for)..."
	@@compass compile -e $(for) stylesheets/application.scss stylesheets/themes/*

js:
	@@echo "Compressing code..."
	@@cp -r javascripts build/

html:
  @@echo "Compressing HTML..."
	@@cp index.html build/

tests:
	@@echo "Running tests..."

clean:
	@@rm -rf build/*
	@@echo "Cleaned build directory."
