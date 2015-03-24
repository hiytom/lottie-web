/****** INIT shapesParser ******/
(function (){
    var currentShape;
    var currentOb;
    var currentFrame;

    function parsePaths(paths,array,lastData,time){
        var i, len = paths.length;
        var frames =[];
        var framesI =[];
        var framesO =[];
        var framesV =[];
        for(i=0;i<len;i+=1){
            var path = paths[i].property('Path').valueAtTime(time,false);
            var frame = {};
            var frameI = {};
            var frameO = {};
            var frameV = {};
            frame.v = extrasInstance.roundNumber(path.vertices,3);
            frame.i = extrasInstance.roundNumber(path.inTangents,3);
            frame.o = extrasInstance.roundNumber(path.outTangents,3);
            frameI = extrasInstance.roundNumber(path.inTangents,3);
            frameO = extrasInstance.roundNumber(path.outTangents,3);
            frameV = extrasInstance.roundNumber(path.vertices,3);
            frames .push(frame);
            framesI .push(frameI);
            framesO .push(frameO);
            framesV .push(frameV);
        }
        /*if(lastData.path == null || extrasInstance.compareObjects(lastData.path,frames) == false){
         array[currentFrame]=frames;
         lastData.path = frames;
         }*/
        if(lastData.pathI == null || extrasInstance.compareObjects(lastData.pathI,framesI) == false){
            array.i[currentFrame]=framesI;
            lastData.pathI = framesI;
        }
        if(lastData.pathO == null || extrasInstance.compareObjects(lastData.pathO,framesO) == false){
            array.o[currentFrame]=framesO;
            lastData.pathO = framesO;
        }
        if(lastData.pathV== null || extrasInstance.compareObjects(lastData.pathV,framesV) == false){
            array.v[currentFrame]=framesV;
            lastData.pathV = framesV;
        }
    }
    function parseStar(){

    }
    function parseRect(info,array, lastData, time){
        //Todo Use this when property has expressions
        return;
        var frame = {};
        frame.size = info.property('Size').valueAtTime(time,false);
        frame.p = extrasInstance.roundNumber(info.property('Position').valueAtTime(time,false),3);
        frame.roundness = extrasInstance.roundNumber(info.property('Roundness').valueAtTime(time,false),3);
        if(lastData.rect == null || extrasInstance.compareObjects(lastData.rect,frame) == false){
            array[currentFrame]=frame;
            lastData.rect = frame;
        }else{
            //array.push(new Object());
        }
    }
    function parseEllipse(info,array, lastData, time){
        //Todo Use this when property has expressions
        return;
        var frame = {};
        frame.size = info.property('Size').valueAtTime(time,false);
        frame.p = extrasInstance.roundNumber(info.property('Position').valueAtTime(time,false),3);
        if(lastData.rect == null || extrasInstance.compareObjects(lastData.rect,frame) == false){
            array[currentFrame]=frame;
            lastData.rect = frame;
        }else{
            //array.push(new Object());
        }
        return frame.size;
    }
    function parseStroke(info,array, lastData, time){
        //Todo Use this when property has expressions
        return;
        var frame = {};
        var color = info.property('Color').valueAtTime(time,false);
        frame.color =extrasInstance.rgbToHex(Math.round(color[0]*255),Math.round(color[1]*255),Math.round(color[2]*255));
        frame.opacity = extrasInstance.roundNumber(info.property('Opacity').valueAtTime(time,false),3);
        frame.width = info.property('Stroke Width').valueAtTime(time,false);
        if(lastData.stroke == null || extrasInstance.compareObjects(lastData.stroke,frame) == false){
            array[currentFrame]=frame;
            lastData.stroke = frame;
        }else{
            //array.push(new Object());
        }
    }
    function parseFill(info,array, lastData, time){
        //Todo Use this when property has expressions
        return;

        var frame = {};
        var color = info.property('Color').valueAtTime(time,false);
        frame.color =extrasInstance.rgbToHex(Math.round(color[0]*255),Math.round(color[1]*255),Math.round(color[2]*255));
        frame.opacity = extrasInstance.roundNumber(info.property('Opacity').valueAtTime(time,false),3);
        if(lastData.fill == null || extrasInstance.compareObjects(lastData.fill,frame) == false){
            array[currentFrame]=frame;
            lastData.fill = frame;
        }else{
            //array.push(new Object());
        }
    }
    function parseTransform(info,array, lastData, time){
        //Todo Use this when property has expressions
        return;
        var frame = {};
        frame.p = extrasInstance.roundNumber(info.property('Position').valueAtTime(time,false),3);
        frame.a = extrasInstance.roundNumber(info.property('Anchor Point').valueAtTime(time,false),3);
        frame.s = [];
        frame.s[0] = extrasInstance.roundNumber(info.property('Scale').valueAtTime(time,false)[0]/100,3);
        frame.s[1] = extrasInstance.roundNumber(info.property('Scale').valueAtTime(time,false)[1]/100,3);
        frame.r = extrasInstance.roundNumber(info.property('Rotation').valueAtTime(time,false)*Math.PI/180,3);
        frame.o = extrasInstance.roundNumber(info.property('Opacity').valueAtTime(time,false),3);
        if(lastData.transform == null || extrasInstance.compareObjects(lastData.transform,frame) == false){
            array[currentFrame]=frame;
            lastData.transform = frame;
        }else{
            //array.push(new Object());
        }
    }

    function parseTrim(info,trim,lastData,time){
        //Todo Use this when property has expressions
        return;
        var frame = {};
        var trimS = extrasInstance.roundNumber(info.property('Start').valueAtTime(time,false),3);
        var trimE = extrasInstance.roundNumber(info.property('End').valueAtTime(time,false),3);
        var trimO = extrasInstance.roundNumber(info.property('Offset').valueAtTime(time,false),3);
        if(lastData.trimS == null || extrasInstance.compareObjects(trimS,lastData.trimS)==false){
            trim.s[currentFrame] = trimS;
            lastData.trimS = trimS;
        }
        if(lastData.trimE == null || extrasInstance.compareObjects(trimE,lastData.trimE)==false){
            trim.e[currentFrame] = trimE;
            lastData.trimE = trimE;
        }
        if(lastData.trimO  == null || extrasInstance.compareObjects(trimO ,lastData.trimO )==false){
            trim.o[currentFrame] = trimO ;
            lastData.trimO = trimO ;
        }
    }

    function parseShape(shapeInfo, shapeOb, time){
        //iterateProperty(shapeInfo,0);
        //Offsets for anchor point;
        var xOffset = 0;
        var yOffset = 0;
        var shapeContents = shapeInfo.property('Contents');

        var paths = [];
        var numProperties = shapeContents.numProperties;
        for(var i = 0;i<numProperties;i+=1){
            if(shapeContents(i+1).matchName == 'ADBE Vector Shape - Group'){
                paths.push(shapeContents(i+1));
            }
        }

        if(shapeContents.property('ADBE Vector Graphic - Stroke')){
            parseStroke(shapeContents.property('ADBE Vector Graphic - Stroke'),shapeOb.an.stroke, shapeOb.lastData, time);
        }
        if(shapeContents.property('ADBE Vector Graphic - Fill')){
            parseFill(shapeContents.property('ADBE Vector Graphic - Fill'),shapeOb.an.fill, shapeOb.lastData, time);
        }
        if(paths.length>0){
            if(shapeOb.an.path){
                parsePaths(paths,shapeOb.an.path, shapeOb.lastData, time);
            }
        }
        if(shapeContents.property('ADBE Vector Shape - Rect')){
            parseRect(shapeContents.property('ADBE Vector Shape - Rect'),shapeOb.an.rect, shapeOb.lastData, time);
        }
        if(shapeContents.property('ADBE Vector Shape - Ellipse')){
            parseEllipse(shapeContents.property('ADBE Vector Shape - Ellipse'),shapeOb.an.ell, shapeOb.lastData, time);
        }
        if(shapeContents.property('ADBE Vector Filter - Trim')){
            parseTrim(shapeContents.property('ADBE Vector Filter - Trim'),shapeOb.trim, shapeOb.lastData, time);
        }
        parseTransform(shapeInfo.property('Transform'),shapeOb.an.tr, shapeOb.lastData, time);
    }

    function addFrameData(layerInfo,layerOb, frameNum, time){
        currentFrame = frameNum;
        var contents = layerInfo.property('Contents');
        /** Todo Use for expressions
        if(contents.property('ADBE Vector Filter - Trim')){
            var trim = layerOb.trim;
            var trimS = extrasInstance.roundNumber(contents.property('ADBE Vector Filter - Trim').property('Start').valueAtTime(time,false),3);
            var trimE = extrasInstance.roundNumber(contents.property('ADBE Vector Filter - Trim').property('End').valueAtTime(time,false),3);
            var trimO = extrasInstance.roundNumber(contents.property('ADBE Vector Filter - Trim').property('Offset').valueAtTime(time,false),3);
            if(layerOb.lastData.trimS == null || extrasInstance.compareObjects(trimS,layerOb.lastData.trimS)==false){
                trim.s[currentFrame] = trimS;
                layerOb.lastData.trimS = trimS;
            }
            if(layerOb.lastData.trimE == null || extrasInstance.compareObjects(trimE,layerOb.lastData.trimE)==false){
                trim.e[currentFrame] = trimE;
                layerOb.lastData.trimE = trimE;
            }
            if(layerOb.lastData.trimO  == null || extrasInstance.compareObjects(trimO ,layerOb.lastData.trimO )==false){
                trim.o[currentFrame] = trimO ;
                layerOb.lastData.trimO = trimO ;
            }
        }
        **/
        var shapes = layerOb.shapes;
        var i,len = shapes.length;
        for(i=0;i<len;i++){
            parseShape(contents.property(shapes[i].name), shapes[i], time);
        }
    }
    function createShapes(layerInfo,layerOb, frameRate){
        var shapes = [];
        layerOb.shapes = shapes;
        var contents = layerInfo.property('Contents');
        if(contents.property('ADBE Vector Filter - Trim')){
            layerOb.trim = {
                's':{},
                'e':{},
                'o':{}
            };
            extrasInstance.convertToBezierValues(contents.property('ADBE Vector Filter - Trim').property('Start'), frameRate, layerOb.trim,'s');
            extrasInstance.convertToBezierValues(contents.property('ADBE Vector Filter - Trim').property('End'), frameRate, layerOb.trim,'e');
            extrasInstance.convertToBezierValues(contents.property('ADBE Vector Filter - Trim').property('Offset'), frameRate, layerOb.trim,'o');
        }
        var i, len = contents.numProperties;
        var shapeInfo, shapeObData;
        for(i=0;i<len;i++){
            shapeInfo = contents.property(i+1);
            var propContents = shapeInfo.property('Contents');
            if(propContents === null){
                continue;
            }
            var type = shapeType(propContents);
            shapeObData = {};
            shapeObData.type = type;
            shapeObData.name = shapeInfo.name;
            shapeObData.an = {};
            if(type === 'pathShape'){
                var pathInfo = propContents.property('ADBE Vector Shape - Group').property('Path').value;
                shapeObData.closed = pathInfo.closed;
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Shape - Group').property('Path'), frameRate, shapeObData,'ks');

            }else if(type === 'rectShape'){
                shapeObData.rc = {};
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Shape - Rect').property('Size'), frameRate, shapeObData.rc,'s');
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Shape - Rect').property('Position'), frameRate, shapeObData.rc,'p');
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Shape - Rect').property('Roundness'), frameRate, shapeObData.rc,'r');
            }else if(type === 'ellipseShape'){
                shapeObData.el = {};
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Shape - Ellipse').property('Size'), frameRate, shapeObData.el,'s');
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Shape - Ellipse').property('Position'), frameRate, shapeObData.el,'p');
            }
            if(propContents.property('ADBE Vector Graphic - Stroke')){
                shapeObData.strokeEnabled = propContents.property('ADBE Vector Graphic - Stroke').enabled;
                shapeObData.st = {};
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Graphic - Stroke').property('Color'), frameRate, shapeObData.st,'c');
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Graphic - Stroke').property('Opacity'), frameRate, shapeObData.st,'o');
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Graphic - Stroke').property('Stroke Width'), frameRate, shapeObData.st,'w');
            }
            if(propContents.property('ADBE Vector Graphic - Fill')){
                shapeObData.fl = {};
                shapeObData.fillEnabled = propContents.property('ADBE Vector Graphic - Fill').enabled;
                var colorProp = propContents.property('ADBE Vector Graphic - Fill').property('Color');
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Graphic - Fill').property('Color'), frameRate, shapeObData.fl,'c');
                extrasInstance.convertToBezierValues(propContents.property('ADBE Vector Graphic - Fill').property('Opacity'), frameRate, shapeObData.fl,'o');
            }
            if(propContents.property('ADBE Vector Filter - Merge')){
                var prop = propContents.property('ADBE Vector Filter - Merge');
                shapeObData.mm = propContents.property('ADBE Vector Filter - Merge').property('ADBE Vector Merge Type').value;
            }
            if(propContents.property('ADBE Vector Filter - Trim')){
                var prop = propContents.property('ADBE Vector Filter - Trim');
                shapeObData.trim = {
                    's':{},
                    'e':{},
                    'o':{}
                };
                extrasInstance.convertToBezierValues(prop.property('Start'), frameRate, shapeObData.trim,'s');
                extrasInstance.convertToBezierValues(prop.property('End'), frameRate, shapeObData.trim,'e');
                extrasInstance.convertToBezierValues(prop.property('Offset'), frameRate, shapeObData.trim,'o');
            }
            shapeObData.an.tr = {};
            shapeObData.tr = {};
            var transformProperty = shapeInfo.property('Transform');
            extrasInstance.convertToBezierValues(transformProperty.property('Position'), frameRate, shapeObData.tr,'p');
            extrasInstance.convertToBezierValues(transformProperty.property('Anchor Point'), frameRate, shapeObData.tr,'a');
            extrasInstance.convertToBezierValues(transformProperty.property('Scale'), frameRate, shapeObData.tr,'s');
            extrasInstance.convertToBezierValues(transformProperty.property('Rotation'), frameRate, shapeObData.tr,'r');
            extrasInstance.convertToBezierValues(transformProperty.property('Opacity'), frameRate, shapeObData.tr,'o');
            shapeObData.lastData = {};
            shapes.push(shapeObData);
        }
    }

    function shapeType(contents){
        if(contents.property('ADBE Vector Shape - Group')){
            return 'pathShape';
        }else if(contents.property('ADBE Vector Shape - Star')){
            return 'starShape';
        }else if(contents.property('ADBE Vector Shape - Rect')){
            return 'rectShape';
        }else if(contents.property('ADBE Vector Shape - Ellipse')){
            return 'ellipseShape';
        }
        //$.writeln(contents.matchName);
        return '';
    }

    var ob = {};
    ob.createShapes = createShapes;
    ob.addFrameData = addFrameData;

    ShapesParser = ob;
}());

/****** END shapesParser ******/