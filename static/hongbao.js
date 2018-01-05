
(function (lib, img, cjs, ss, an) {

  var p; // shortcut to reference prototypes
  lib.webFontTxtInst = {};
  var loadedTypekitCount = 0;
  var loadedGoogleCount = 0;
  var gFontsUpdateCacheList = [];
  var tFontsUpdateCacheList = [];
  lib.ssMetadata = [];



  lib.updateListCache = function (cacheList) {
    for(var i = 0; i < cacheList.length; i++) {
      if(cacheList[i].cacheCanvas)
        cacheList[i].updateCache();
    }
  };

  lib.addElementsToCache = function (textInst, cacheList) {
    var cur = textInst;
    while(cur != exportRoot) {
      if(cacheList.indexOf(cur) != -1)
        break;
      cur = cur.parent;
    }
    if(cur != exportRoot) {
      var cur2 = textInst;
      var index = cacheList.indexOf(cur);
      while(cur2 != cur) {
        cacheList.splice(index, 0, cur2);
        cur2 = cur2.parent;
        index++;
      }
    }
    else {
      cur = textInst;
      while(cur != exportRoot) {
        cacheList.push(cur);
        cur = cur.parent;
      }
    }
  };

  lib.gfontAvailable = function(family, totalGoogleCount) {
    lib.properties.webfonts[family] = true;
    var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
    for(var f = 0; f < txtInst.length; ++f)
      lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);

    loadedGoogleCount++;
    if(loadedGoogleCount == totalGoogleCount) {
      lib.updateListCache(gFontsUpdateCacheList);
    }
  };

  lib.tfontAvailable = function(family, totalTypekitCount) {
    lib.properties.webfonts[family] = true;
    var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
    for(var f = 0; f < txtInst.length; ++f)
      lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);

    loadedTypekitCount++;
    if(loadedTypekitCount == totalTypekitCount) {
      lib.updateListCache(tFontsUpdateCacheList);
    }
  };
// symbols:



  (lib.补间4 = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{});

    // 图层 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#F9D9A6").s().p("Aw8PiIAA/DMAh5AAAIAAfDg");
    this.shape.setTransform(0,4);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FAF0F5").s().p("AxuRHMAAAgiNIBQAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBkAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBuAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFICCAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBvAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBRAAMAAAAiNg");

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-113.5,-109.5,227,219);


  (lib.补间3 = function(mode,startPosition,loop) {
    this.initialize(mode,startPosition,loop,{});

    // 图层 1
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#F9D9A6").s().p("Aw8PiIAA/DMAh5AAAIAAfDg");
    this.shape.setTransform(0,4);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#FAF0F5").s().p("AxuRHMAAAgiNIBQAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBkAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBuAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFICCAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBvAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBRAAMAAAAiNg");

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(-113.5,-109.5,227,219);


// stage content:
  (lib.红包 = function(mode,startPosition,loop) {
    if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{});

    // 图层 5 复制
    this.shape = new cjs.Shape();
    this.shape.graphics.f("#EE9DBA").s().p("AhbDJQgEgEAAgHIAAh4Ig/AAQgEAAgEgDQgEgDgBgDQgQgiAAgqQAAhOA3g4QA4g3BNAAQBOAAA2A3QA4A4gBBOQAAAcgJAgQgFAKgKgBIgFgBQgFgCgCgGQgCgGABgEQAKgYAAgbQAAhCgvguQgvgwhCAAQhBAAgvAwQgvAuAABCQAAAZAFASQAEANAPAAIDVAAQAGAAAFAFQAEAFAAAFIAAA/QAAAFgEAFQgFAFgGAAQgGAAgFgFQgEgEAAgGIAAgwIgXAAIAABpQAAAGgEAFQgFAEgGAAQgHAAgEgEQgEgEAAgHIAAhpIgYAAIAABAQAAAFgEAFQgFAFgGgBQgGAAgFgEQgEgEAAgGIAAhAIgWAAIAAB4QAAAGgFAEQgEAFgGAAQgHAAgEgEg");
    this.shape.setTransform(88.4,218.9,0.815,0.815);

    this.shape_1 = new cjs.Shape();
    this.shape_1.graphics.f("#EE9DBA").s().p("AgJALQgFgEAAgHQAAgFAEgEQAEgFAGAAQAHAAAEAFQAEAEAAAFQAAAHgEADQgEAFgHAAQgFAAgEgEg");
    this.shape_1.setTransform(86,232.8,0.815,0.815);

    this.shape_2 = new cjs.Shape();
    this.shape_2.graphics.f("#EE9DBA").s().p("AgJAiQgFgEAAgHIAAgtQAAgHAEgEQAEgEAGAAQAGAAAEAEQAFAFAAAGIAAAtQAAAHgEAEQgEAEgHAAQgFAAgEgEg");
    this.shape_2.setTransform(94.8,233.4,0.815,0.815);

    this.shape_3 = new cjs.Shape();
    this.shape_3.graphics.f("#EE9DBA").s().p("AhLBgQgVgaABgmIAAikIAxAAIAACaQAAAdALANQAPASAUAAQAUABANgNQAMgPAAgSQAAgUgMgOQgNgMgUABQgPgBgSANIAAgwQATgMAUAAQAlAAAaAcQAbAcAAAlQAAApgcAbQgcAcgoAAQgvAAgcglg");
    this.shape_3.setTransform(211.2,220.8,0.815,0.815);

    this.shape_4 = new cjs.Shape();
    this.shape_4.graphics.f("#EE9DBA").s().p("Ag+BCQgTgWABglIAAhjIAwAAIAABeQAAAqAgAAQARAAAKgOQAFgMAAgSIAAhcIAyAAIAABlQAAAogXAVQgVAXglAAQgpAAgWgbg");
    this.shape_4.setTransform(195.4,224,0.815,0.815);

    this.shape_5 = new cjs.Shape();
    this.shape_5.graphics.f("#EE9DBA").s().p("AApCCIAAhvIhRAAIAABvIg3AAIAAkDIA3AAIAABmIBRAAIAAhmIA3AAIAAEDg");
    this.shape_5.setTransform(178.7,220.6,0.815,0.815);

    this.shape_6 = new cjs.Shape();
    this.shape_6.graphics.f("#EE9DBA").s().p("AhCBEQgcgbAAgpQAAgmAcgcQAcgdAnAAQA9ABAbA9IhkA9IgSgeIA8goQgLgOgUABQgSgBgMAPQgNARAAAVQAAAVAOARQANAQAUABQAqABARgsIAgAZQgQAcgQANQgZAUglABQgnAAgcgcg");
    this.shape_6.setTransform(162.3,223.8,0.815,0.815);

    this.shape_7 = new cjs.Shape();
    this.shape_7.graphics.f("#EE9DBA").s().p("AAaBXQgPgJgKgMQgVAbgkAAQgjAAgUgYQgRgTAAggIAAhuIAxAAIAABnQAAAhAbAAQAcAAAAgiIAAhmIAwAAIAABlQAAAjAcgBQAQAAAHgLQAEgGAAgPIABhnIAxAAIAABsQAAAjgUAVQgUAVgfAAQgTAAgNgGg");
    this.shape_7.setTransform(143.3,224,0.815,0.815);

    this.shape_8 = new cjs.Shape();
    this.shape_8.graphics.f("#EE9DBA").s().p("AhRBcIAAhjQAAgoAWgVQAWgXAlAAQAmAAAWAXQAWAWAAAnIgBBiIgxAAIAAhcQAAgVgHgJQgJgMgQAAQgRAAgJAOQgGAJAAATIAABdg");
    this.shape_8.setTransform(124.9,223.8,0.815,0.815);

    this.shape_9 = new cjs.Shape();
    this.shape_9.graphics.f("#EE9DBA").s().p("AgbCCIAAkDIA2AAIAAEDg");
    this.shape_9.setTransform(113.9,220.6,0.815,0.815);

    this.shape_10 = new cjs.Shape();
    this.shape_10.graphics.f("#E54778").s().p("A0ASIQgxAAgjgjQgjgjAAgxMAAAgggQAAgxAjgkQAjgjAxAAIAPAAIABAAIQFNcQBkBjCMAAQCNABBkhkIQNtcIAAAAQAwABAiAiQAjAkAAAxMAAAAggQAAAxgjAjQgkAjgxAAg");
    this.shape_10.setTransform(146.9,211.9);

    this.shape_11 = new cjs.Shape();
    this.shape_11.graphics.f("#B93060").s().p("Az5HgIQFtbQBkhjCNgBQCMAABkBjIQNNcg");
    this.shape_11.setTransform(147.8,95.9,1,1,0,180,0,0,48);

    this.shape_12 = new cjs.Shape();
    this.shape_12.graphics.f("#F9D9A6").s().p("Aw8PiIAA/DMAh5AAAIAAfDg");
    this.shape_12.setTransform(147.4,221.4);

    this.shape_13 = new cjs.Shape();
    this.shape_13.graphics.f("#FAF0F5").s().p("AxuRHMAAAgiNIBQAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBkAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBuAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFICCAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBvAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBRAAMAAAAiNg");
    this.shape_13.setTransform(147.4,217.4);

    this.shape_14 = new cjs.Shape();
    this.shape_14.graphics.f("#B93060").s().p("AgDHgQiNAAhkhkIwFtbMAnzAAAIwNNcQhkBjiLAAIgBAAg");
    this.shape_14.setTransform(147.8,143.9);

    this.shape_15 = new cjs.Shape();
    this.shape_15.graphics.f("#EAEAEA").s().p("Az+SIQgyAAgkgkQgjgjAAgxMAAAggeQAAgyAjgkQAkgjAyAAMAn9AAAQAyAAAjAjQAkAkAAAyMAAAAgeQAAAxgkAjQgjAkgyAAg");
    this.shape_15.setTransform(146.9,211.9);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_15,p:{rotation:0,x:146.9}},{t:this.shape_14,p:{rotation:0,x:147.8,y:143.9}},{t:this.shape_13,p:{rotation:0,x:147.4,y:217.4}},{t:this.shape_12,p:{rotation:0,x:147.4,y:221.4}},{t:this.shape_11,p:{regX:0,skewX:180,skewY:0,x:147.8,y:95.9}},{t:this.shape_10,p:{rotation:0,x:146.9}},{t:this.shape_9,p:{rotation:0,x:113.9,y:220.6}},{t:this.shape_8,p:{rotation:0,x:124.9,y:223.8}},{t:this.shape_7,p:{rotation:0,x:143.3,y:224}},{t:this.shape_6,p:{rotation:0,x:162.3,y:223.8}},{t:this.shape_5,p:{rotation:0,x:178.7,y:220.6}},{t:this.shape_4,p:{rotation:0,x:195.4,y:224}},{t:this.shape_3,p:{rotation:0,x:211.2,y:220.8}},{t:this.shape_2,p:{rotation:0,x:94.8,y:233.4}},{t:this.shape_1,p:{rotation:0,x:86,y:232.8}},{t:this.shape,p:{rotation:0,x:88.4,y:218.9}}]}).to({state:[{t:this.shape_15,p:{rotation:-2.4,x:147}},{t:this.shape_14,p:{rotation:-2.4,x:145,y:143.9}},{t:this.shape_13,p:{rotation:-2.4,x:147.7,y:217.4}},{t:this.shape_12,p:{rotation:-2.4,x:147.9,y:221.4}},{t:this.shape_11,p:{regX:-0.1,skewX:177.6,skewY:-2.4,x:142.9,y:96.1}},{t:this.shape_10,p:{rotation:-2.4,x:147}},{t:this.shape_9,p:{rotation:-2.4,x:113.5,y:220.9}},{t:this.shape_8,p:{rotation:-2.4,x:124.6,y:223.6}},{t:this.shape_7,p:{rotation:-2.4,x:143,y:223.1}},{t:this.shape_6,p:{rotation:-2.4,x:162,y:222.1}},{t:this.shape_5,p:{rotation:-2.4,x:178.2,y:218.1}},{t:this.shape_4,p:{rotation:-2.4,x:195,y:220.9}},{t:this.shape_3,p:{rotation:-2.4,x:210.7,y:217}},{t:this.shape_2,p:{rotation:-2.4,x:95,y:234.5}},{t:this.shape_1,p:{rotation:-2.4,x:86.2,y:234.3}},{t:this.shape,p:{rotation:-2.4,x:87.9,y:220.3}}]},2).to({state:[{t:this.shape_15,p:{rotation:3,x:146.9}},{t:this.shape_14,p:{rotation:3,x:151.4,y:144.1}},{t:this.shape_13,p:{rotation:3,x:147.1,y:217.5}},{t:this.shape_12,p:{rotation:3,x:146.9,y:221.5}},{t:this.shape_11,p:{regX:-0.1,skewX:-177,skewY:3,x:153.8,y:96.2}},{t:this.shape_10,p:{rotation:3,x:146.9}},{t:this.shape_9,p:{rotation:3,x:113.1,y:217.9}},{t:this.shape_8,p:{rotation:3,x:123.9,y:221.6}},{t:this.shape_7,p:{rotation:3,x:142.3,y:222.9}},{t:this.shape_6,p:{rotation:3,x:161.2,y:223.6}},{t:this.shape_5,p:{rotation:3,x:177.8,y:221.3}},{t:this.shape_4,p:{rotation:3,x:194.2,y:225.6}},{t:this.shape_3,p:{rotation:3,x:210.2,y:223.2}},{t:this.shape_2,p:{rotation:3,x:93.4,y:229.6}},{t:this.shape_1,p:{rotation:3,x:84.6,y:228.6}},{t:this.shape,p:{rotation:3,x:87.7,y:214.9}}]},2).to({state:[{t:this.shape_15,p:{rotation:-4,x:146.9}},{t:this.shape_14,p:{rotation:-4,x:143.1,y:144}},{t:this.shape_13,p:{rotation:-4,x:147.8,y:217.3}},{t:this.shape_12,p:{rotation:-4,x:148.1,y:221.3}},{t:this.shape_11,p:{regX:-0.1,skewX:176,skewY:-4,x:139.7,y:96.2}},{t:this.shape_10,p:{rotation:-4,x:146.9}},{t:this.shape_9,p:{rotation:-4,x:114.2,y:222.7}},{t:this.shape_8,p:{rotation:-4,x:125.4,y:225.1}},{t:this.shape_7,p:{rotation:-4,x:143.8,y:224.2}},{t:this.shape_6,p:{rotation:-4,x:162.8,y:222.6}},{t:this.shape_5,p:{rotation:-4,x:178.9,y:218.3}},{t:this.shape_4,p:{rotation:-4,x:195.8,y:220.6}},{t:this.shape_3,p:{rotation:-4,x:211.3,y:216.2}},{t:this.shape_2,p:{rotation:-4,x:96.1,y:236.8}},{t:this.shape_1,p:{rotation:-4,x:87.3,y:236.9}},{t:this.shape,p:{rotation:-4,x:88.7,y:222.9}}]},2).to({state:[{t:this.shape_15,p:{rotation:0,x:146.9}},{t:this.shape_14,p:{rotation:0,x:147.8,y:143.9}},{t:this.shape_13,p:{rotation:0,x:147.4,y:217.4}},{t:this.shape_12,p:{rotation:0,x:147.4,y:221.4}},{t:this.shape_11,p:{regX:0,skewX:180,skewY:0,x:147.8,y:95.9}},{t:this.shape_10,p:{rotation:0,x:146.9}},{t:this.shape_9,p:{rotation:0,x:113.9,y:220.6}},{t:this.shape_8,p:{rotation:0,x:124.9,y:223.8}},{t:this.shape_7,p:{rotation:0,x:143.3,y:224}},{t:this.shape_6,p:{rotation:0,x:162.3,y:223.8}},{t:this.shape_5,p:{rotation:0,x:178.7,y:220.6}},{t:this.shape_4,p:{rotation:0,x:195.4,y:224}},{t:this.shape_3,p:{rotation:0,x:211.2,y:220.8}},{t:this.shape_2,p:{rotation:0,x:94.8,y:233.4}},{t:this.shape_1,p:{rotation:0,x:86,y:232.8}},{t:this.shape,p:{rotation:0,x:88.4,y:218.9}}]},2).to({state:[{t:this.shape_15,p:{rotation:0,x:146.9}},{t:this.shape_14,p:{rotation:0,x:147.8,y:143.9}},{t:this.shape_13,p:{rotation:0,x:147.4,y:217.4}},{t:this.shape_12,p:{rotation:0,x:147.4,y:221.4}},{t:this.shape_11,p:{regX:0,skewX:180,skewY:0,x:147.8,y:95.9}},{t:this.shape_10,p:{rotation:0,x:146.9}},{t:this.shape_9,p:{rotation:0,x:113.9,y:220.6}},{t:this.shape_8,p:{rotation:0,x:124.9,y:223.8}},{t:this.shape_7,p:{rotation:0,x:143.3,y:224}},{t:this.shape_6,p:{rotation:0,x:162.3,y:223.8}},{t:this.shape_5,p:{rotation:0,x:178.7,y:220.6}},{t:this.shape_4,p:{rotation:0,x:195.4,y:224}},{t:this.shape_3,p:{rotation:0,x:211.2,y:220.8}},{t:this.shape_2,p:{rotation:0,x:94.8,y:233.4}},{t:this.shape_1,p:{rotation:0,x:86,y:232.8}},{t:this.shape,p:{rotation:0,x:88.4,y:218.9}}]},2).to({state:[]},1).wait(20));

    // 图层 1
    this.shape_16 = new cjs.Shape();
    this.shape_16.graphics.f("#EE9DBA").s().p("AhbDJQgEgEAAgHIAAh4Ig/AAQgEAAgEgDQgEgDgBgDQgQgiAAgqQAAhOA3g4QA4g3BNAAQBOAAA2A3QA4A4gBBOQAAAcgJAgQgFAKgKgBIgFgBQgFgCgCgGQgCgGABgEQAKgYAAgbQAAhCgvguQgvgwhCAAQhBAAgvAwQgvAuAABCQAAAZAFASQAEANAPAAIDVAAQAGAAAFAFQAEAFAAAFIAAA/QAAAFgEAFQgFAFgGAAQgGAAgFgFQgEgEAAgGIAAgwIgXAAIAABpQAAAGgEAFQgFAEgGAAQgHAAgEgEQgEgEAAgHIAAhpIgYAAIAABAQAAAFgEAFQgFAFgGgBQgGAAgFgEQgEgEAAgGIAAhAIgWAAIAAB4QAAAGgFAEQgEAFgGAAQgHAAgEgEg");
    this.shape_16.setTransform(88.4,218.9,0.815,0.815);

    this.shape_17 = new cjs.Shape();
    this.shape_17.graphics.f("#EE9DBA").s().p("AgJALQgFgEAAgHQAAgFAEgEQAEgFAGAAQAHAAAEAFQAEAEAAAFQAAAHgEADQgEAFgHAAQgFAAgEgEg");
    this.shape_17.setTransform(86,232.8,0.815,0.815);

    this.shape_18 = new cjs.Shape();
    this.shape_18.graphics.f("#EE9DBA").s().p("AgJAiQgFgEAAgHIAAgtQAAgHAEgEQAEgEAGAAQAGAAAEAEQAFAFAAAGIAAAtQAAAHgEAEQgEAEgHAAQgFAAgEgEg");
    this.shape_18.setTransform(94.8,233.4,0.815,0.815);

    this.shape_19 = new cjs.Shape();
    this.shape_19.graphics.f("#EE9DBA").s().p("AhLBgQgVgaABgmIAAikIAxAAIAACaQAAAdALANQAPASAUAAQAUABANgNQAMgPAAgSQAAgUgMgOQgNgMgUABQgPgBgSANIAAgwQATgMAUAAQAlAAAaAcQAbAcAAAlQAAApgcAbQgcAcgoAAQgvAAgcglg");
    this.shape_19.setTransform(211.2,220.8,0.815,0.815);

    this.shape_20 = new cjs.Shape();
    this.shape_20.graphics.f("#EE9DBA").s().p("Ag+BCQgTgWABglIAAhjIAwAAIAABeQAAAqAgAAQARAAAKgOQAFgMAAgSIAAhcIAyAAIAABlQAAAogXAVQgVAXglAAQgpAAgWgbg");
    this.shape_20.setTransform(195.4,224,0.815,0.815);

    this.shape_21 = new cjs.Shape();
    this.shape_21.graphics.f("#EE9DBA").s().p("AApCCIAAhvIhRAAIAABvIg3AAIAAkDIA3AAIAABmIBRAAIAAhmIA3AAIAAEDg");
    this.shape_21.setTransform(178.7,220.6,0.815,0.815);

    this.shape_22 = new cjs.Shape();
    this.shape_22.graphics.f("#EE9DBA").s().p("AhCBEQgcgbAAgpQAAgmAcgcQAcgdAnAAQA9ABAbA9IhkA9IgSgeIA8goQgLgOgUABQgSgBgMAPQgNARAAAVQAAAVAOARQANAQAUABQAqABARgsIAgAZQgQAcgQANQgZAUglABQgnAAgcgcg");
    this.shape_22.setTransform(162.3,223.8,0.815,0.815);

    this.shape_23 = new cjs.Shape();
    this.shape_23.graphics.f("#EE9DBA").s().p("AAaBXQgPgJgKgMQgVAbgkAAQgjAAgUgYQgRgTAAggIAAhuIAxAAIAABnQAAAhAbAAQAcAAAAgiIAAhmIAwAAIAABlQAAAjAcgBQAQAAAHgLQAEgGAAgPIABhnIAxAAIAABsQAAAjgUAVQgUAVgfAAQgTAAgNgGg");
    this.shape_23.setTransform(143.3,224,0.815,0.815);

    this.shape_24 = new cjs.Shape();
    this.shape_24.graphics.f("#EE9DBA").s().p("AhRBcIAAhjQAAgoAWgVQAWgXAlAAQAmAAAWAXQAWAWAAAnIgBBiIgxAAIAAhcQAAgVgHgJQgJgMgQAAQgRAAgJAOQgGAJAAATIAABdg");
    this.shape_24.setTransform(124.9,223.8,0.815,0.815);

    this.shape_25 = new cjs.Shape();
    this.shape_25.graphics.f("#EE9DBA").s().p("AgbCCIAAkDIA2AAIAAEDg");
    this.shape_25.setTransform(113.9,220.6,0.815,0.815);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16}]},10).wait(21));

    // 图层 2
    this.shape_26 = new cjs.Shape();
    this.shape_26.graphics.f("#E54778").s().p("A0ASIQgxAAgjgjQgjgjAAgxMAAAgggQAAgxAjgkQAjgjAxAAIAPAAIABAAIQFNcQBkBjCMAAQCNABBkhkIQNtcIAAAAQAwABAiAiQAjAkAAAxMAAAAggQAAAxgjAjQgkAjgxAAg");
    this.shape_26.setTransform(146.9,211.9);
    this.shape_26._off = true;

    this.timeline.addTween(cjs.Tween.get(this.shape_26).wait(10).to({_off:false},0).wait(21));

    // 内容2
    this.instance = new lib.补间3("synched",0);
    this.instance.parent = this;
    this.instance.setTransform(147.4,217.4);
    this.instance._off = true;

    this.instance_1 = new lib.补间4("synched",0);
    this.instance_1.parent = this;
    this.instance_1.setTransform(147.4,134.2);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},18).to({state:[{t:this.instance_1}]},12).wait(1));
    this.timeline.addTween(cjs.Tween.get(this.instance).wait(18).to({_off:false},0).to({_off:true,y:134.2},12).wait(1));

    // 盖子2
    this.shape_27 = new cjs.Shape();
    this.shape_27.graphics.f("#B93060").s().p("Az5HgIQFtbQBkhjCNgBQCMAABkBjIQNNcg");
    this.shape_27.setTransform(147.8,95.9,1,1,0,180,0,0,48);

    this.shape_28 = new cjs.Shape();
    this.shape_28.graphics.f("#B93060").s().p("ABgHgQiKgBhqhTIw6rLIUJiPQCAgRCHAAQCIAACAARIKFBHIlbGvIofFlQhpBTiKAAIgCAAg");
    this.shape_28.setTransform(143.4,127.9);

    this.shape_29 = new cjs.Shape();
    this.shape_29.graphics.f("#B93060").s().p("ADFHgQiLAAhvhDIxuo8ITWkeQB6ghCHgBQCJAAB7AhIJsCPIiuGvIo4EeQhvBCiIAAIgCAAg");
    this.shape_29.setTransform(139.1,111.9);

    this.shape_30 = new cjs.Shape();
    this.shape_30.graphics.f("#B93060").s().p("AAqGuIyhmuIShmtQB0gyCKAAQCKAAB1AyIJRDWIAAGvIpRDWQh1AyiJAAQiJgBh2gxg");
    this.shape_30.setTransform(134.8,96);

    this.shape_31 = new cjs.Shape();
    this.shape_31.graphics.f("#B93060").s().p("AAzG+IzWkeIRuo8QBvhDCKAAQCLAABvBCII4EeICuGvIpsCPQh6AhiIAAQiIgBh7ghg");
    this.shape_31.setTransform(139.1,80);

    this.shape_32 = new cjs.Shape();
    this.shape_32.graphics.f("#B93060").s().p("AA8HPI0KiPIQ6rLQBphTCLgBQCMAABqBTIIeFlIFbGvIqFBHQiAARiGAAQiIAAiAgRg");
    this.shape_32.setTransform(143.4,64);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_27,p:{skewX:180,y:95.9}}]},10).to({state:[{t:this.shape_28}]},1).to({state:[{t:this.shape_29}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_31}]},1).to({state:[{t:this.shape_32}]},1).to({state:[{t:this.shape_27,p:{skewX:0,y:96}}]},1).wait(15));

    // 内容1
    this.shape_33 = new cjs.Shape();
    this.shape_33.graphics.f("#F9D9A6").s().p("Aw8PiIAA/DMAh5AAAIAAfDg");
    this.shape_33.setTransform(147.4,221.4);

    this.shape_34 = new cjs.Shape();
    this.shape_34.graphics.f("#FAF0F5").s().p("AxuRHMAAAgiNIBQAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBkAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIAAgFIBuAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFICCAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBvAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBlAAIAAAFQAAAjAZAZQAZAZAjAAQAjAAAZgZQAZgZAAgjIgBgFIBRAAMAAAAiNg");
    this.shape_34.setTransform(147.4,217.4);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_34},{t:this.shape_33}]},10).to({state:[{t:this.shape_34},{t:this.shape_33}]},6).to({state:[{t:this.shape_34},{t:this.shape_33}]},14).wait(1));

    // 图层 5
    this.shape_35 = new cjs.Shape();
    this.shape_35.graphics.f("#B93060").s().p("AgDHgQiNAAhkhkIwFtbMAnzAAAIwNNcQhkBjiLAAIgBAAg");
    this.shape_35.setTransform(147.8,143.9);

    this.shape_36 = new cjs.Shape();
    this.shape_36.graphics.f("#EAEAEA").s().p("Az+SIQgyAAgkgkQgjgjAAgxMAAAggeQAAgyAjgkQAkgjAyAAMAn9AAAQAyAAAjAjQAkAkAAAyMAAAAgeQAAAxgkAjQgjAkgyAAg");
    this.shape_36.setTransform(146.9,211.9);

    this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_36},{t:this.shape_35}]},10).to({state:[{t:this.shape_36},{t:this.shape_35}]},20).wait(1));

  }).prototype = p = new cjs.MovieClip();
  p.nominalBounds = new cjs.Rectangle(153.4,263.9,280,232);
// library properties:
  lib.properties = {
    width: 293,
    height: 336,
    fps: 24,
    color: "#FFFFFF",
    opacity: 0.00,
    webfonts: {},
    manifest: [],
    preloads: []
  };




})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{}, AdobeAn = AdobeAn||{});
var lib, images, createjs, ss, AdobeAn;
