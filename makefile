# Libraries

NODEPATH ?= "./node_modules"
JS_UGLIFY = $(NODEPATH)/uglify-js2/bin/uglifyjs2

all: \
	dpl.js \
	dpl.min.js
	

.INTERMEDIATE dpl.js: \
	src/start.js \
	src/core/rebind.js \
	src/core/set.js \
	src/core/axis.js \
	src/core/frame.js \
	src/core/project.js \
	src/core/render.js \
	src/plugin/fitScale.js \
	src/plugin/setTitle.js \
	src/plugin/showAxes.js \
	src/plugin/legend.js \
	src/plugin/bbox.js \
	src/plugin/subplot.js \
	src/plugin/lineEdit.js \
	src/util/pathbox.js\
	src/chart.js \
	src/end.js

dpl.js: Makefile
	@rm -f $@
	@cat $(filter %.js,$^) > $@.tmp
	$(JS_UGLIFY) $@.tmp -b indent-level=2 -o $@
	@rm $@.tmp

dpl.min.js: dpl.js Makefile
	@rm -f $@
	$(JS_UGLIFY) $< -c -m -o $@
	