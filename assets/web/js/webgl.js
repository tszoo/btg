var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var BTG = {
    App: function () {
        var isDebugMode = true;
        var path = 'assets/web/model/';
        var camera, scene, renderer, controls, request, textureObj = {};
        var windowHalfX, windowHalfY, mouseX=0, mouseY=0;
        var OBJ;
        var self = this;
        var minSize={h:0,w:0};
        var tempSize ={w:0,h:0};
        var isFirstIn = true;
        var isRender = true;
        var isLoadStart = false;
        var isLoadComplete = false;
        var isMouseMove = false;
        var isMouseInteraction = false;
        var gui, stats;
        var cameraTweenSpeed = 3;
        var currentScene;
        var airP=[];
        var birdGrp = [], birdLtArr = [], birdRtArr = [];
        var lensflare, flareTween, caveLight, caveLight2;
        var cloud, fog;
        var mouseTimeout;
        var currentSceneIdx = 0;
        var param = {
            mouseDepth: 1,
            cameraLimitX : 2,
            cameraLimitY : 0.5,
            cameraFov : 45,
            camera_control: false,
            model:'soldier'
        };
        var lastMousePos= {x:0,y:0};

        var OBJ_DATA = {
            'cave': {
                'material': {
                    'light':{map: 'light', alpha:'light_Alpha', blending:'AdditiveBlending', transparent:true , side:'DoubleSide'},
                    'light2':{map: 'light', alpha:'light_Alpha',blending:'AdditiveBlending', transparent:true, side:'DoubleSide'},
                    'wood': {map: "wood",alpha:''},
                    'Cave': {map: "cave", transparent:false, alphaTest:0.16},
                    'bell': {map: "bell",alpha:''},
                    'Rock': {map: "rock",alpha:''},
                    'Rock_B': {map: "rock_L",alpha:'rock_L_Alpha', transparent:true},
                    'grass_A': {map: "grass",alpha:'grass_Alpha', transparent:true},
                    'grass_A2': {map: "grass",alpha:'grass_Alpha', transparent:true},
                    'grass_B': {map: "grass_B",alpha:'grass_B_Alpha', transparent:false, alphaTest:0.16,  side:'DoubleSide'},
                    'tree_A': {map: "tree_A",alpha:''},
                    'fog_plane': {map: "clouds",alpha:'clouds_trans'},
                    'BG1':{map: "",alpha:'', color:'eaf7ee'},
                },
                'camera': {
                    'pos': {x: 5, y: -32, z: isMobile.any() ? 97: 94},
                    'fov': isMobile.any() ? 50 :44,
                    'limit':{x:isMobile.any() ? 1: 1.5,y: 1}
                }
            },
            'aircraft': {
                'material': {
                    'aircraft_wings': {map: "aircraft_wing_patch",alpha:'', env:'env_sky'},
                    'aircraft_body': {map: "aircraft_body_patch",alpha:'', env:'env_sky'},
                    'propeller_R02': {map: "propeller_color",alpha:'propeller_alpha', transparent:true, alphaTest:0.16},
                    'propeller_R01': {map: "propeller_color",alpha:'propeller_alpha', transparent:true, alphaTest:0.16},
                    'propeller_L02': {map: "propeller_color",alpha:'propeller_alpha', transparent:true, alphaTest:0.16},
                    'propeller_L01': {map: "propeller_color",alpha:'propeller_alpha', transparent:true, alphaTest:0.16},
                    'BG': {map: "only_bg_02",alpha:''},
                },
                'camera': {
                    'pos': {x: 0, y: 27.06, z: 56},
                    'fov': isMobile.any() ? 42 : 34,
                    'limit':{x: 2, y: isMobile.any() ?1 :2}
                }
            },
            'soldier':{
                'material': {
                    'BG': {map: "BG"},
                    'ug': {map: "right_grass",alpha:'right_grass_ALL', transparent:true},
                    'ug_01': {map: "right_grass",alpha:'right_grass_ALL', transparent:true},
                    'bush': {map: "grass_B",alpha:'grass_B_Alpha', transparent:true, alphaTest:0.5, depthTest:true,depthWrite:true},
                    'grass_right': {map: "right_grass",alpha:'right_grass_ALL', transparent:false, alphaTest:0.5, depthTest:true, depthWrite:true},
                    'grass_left1': {map: "left_grass",alpha:'left_grass_ALL', transparent:false, alphaTest:0.5, depthTest:true, depthWrite:true},
                    'sol_leg_rt': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_leg_lt': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_bag': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_torso': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_arm_lt': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_arm_rt': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_magun': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_helmet': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_secgun': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'sol_pocket': {map: "soldier",alpha:'soldier_alpha', transparent:true},
                    'cloud_near01': {map: "clouds", transparent:true},
                    'cloud_near02': {map: "clouds", transparent:true},
                    'cloud_far01': {map: "clouds", transparent:true},
                    'cloud_far02': {map: "clouds",transparent:true},
                    'cloud_far03': {map: "clouds",transparent:true},
                    'cloud_far04': {map: "clouds", transparent:true},
                    'bird_winglt': {map: "Birds5",alpha:'Birds5_a', transparent:true , side:'DoubleSide'},
                    'bird_wingrt': {map: "Birds5",alpha:'Birds5_a', transparent:true , side:'DoubleSide'},
                    'bird_body': {map: "Birds5",alpha:'Birds5_a', transparent:true},
                },
                'camera': {
                    'pos': {x: -1, y: -6.6, z:isMobile.any() ? 16 : 20},
                    'fov':isMobile.any() ? 33 : 30,
                    'limit':{x: 1, y: 0.5}
                }
            }
        };

        var OBJ_TEXTURE ={
            'cave': {
                'texture':[
                    'bell.jpg',
                    'cave.jpg',
                    'grass.jpg',
                    'grass_Alpha.jpg',
                    'grass_B.jpg',
                    'grass_B_Alpha.jpg',
                    'light.jpg',
                    'light_Alpha.jpg',
                    'rock.jpg',
                    'rock_L.jpg',
                    'rock_L_Alpha.jpg',
                    'tree_A.jpg',
                    'tree_B.jpg',
                    'wood.jpg'
                ]},
            'aircraft': {
                'texture':[
                    'aircraft_body_patch.jpg',
                    'aircraft_wing_patch.jpg',
                    'only_bg_02.jpg',
                    'env_sky.jpg',
                    'propeller_alpha.jpg',
                    'propeller_color.jpg'
                ]
            },
            soldier:{
                'texture':[
                    'Birds5.jpg',
                    'Birds5_A.jpg',
                    'grass_B.jpg',
                    'grass_B_Alpha.jpg',
                    'left_grass.jpg',
                    'left_grass_ALL.jpg',
                    'right_grass.jpg',
                    'right_grass_ALL.jpg',
                    'BG.jpg',
                    'soldier.jpg',
                    'soldier_alpha.jpg',
                    'tree_A.jpg',
                    'tree_B.jpg',
                ]
            }
        }

        this.dom;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.customParam  = function(){
            stats = new Stats();
            this.dom.appendChild(stats.domElement);

            gui=  new dat.GUI();
            gui.add(param, 'mouseDepth', 1, 10, 0.5).onChange( changeUpdate ).name('mouse');
            gui.add(param, 'cameraLimitX', 0, 100, 0.1).onChange( changeUpdate ).name('camera limitX');
            gui.add(param, 'cameraLimitY', 0, 100, 0.1).onChange( changeUpdate ).name('camera limitY');
            gui.add(param, 'cameraFov', 0, 100, 1).onChange( changeUpdate ).name('camera fov');
            gui.add(param, 'camera_control', param.camera_control).onChange( changeUpdate ).name('controls');
            gui.add(param, 'model', ['cave', 'aircraft', 'soldier']).onChange( self.reloadModel ).name('model change');
        };

        this.reloadModel = function(_model){
            currentScene = _model;
            if(flareTween){
                flareTween.kill();
            }

            //$('#MAIN .title_container .title_inner').removeClass('active');
            isMouseInteraction = false;
            //window.removeEventListener("deviceorientation", onDeviceOrientation);
            //document.removeEventListener( 'mousemove', onDocumentMouseMove);

            self.stop();
            self.load();
        }

        function changeUpdate(){
            controls.enabled = param.camera_control;
            param.mouseDepth = param.mouseDepth;
            OBJ_DATA[currentScene].camera.limit.x = param.cameraLimitX;
            OBJ_DATA[currentScene].camera.limit.y = param.cameraLimitY;
            camera.fov = param.cameraFov;
            camera.updateProjectionMatrix();
            console.log('controls' , controls)
        }

        function resizeFunc(){
            var innerW = $('#webgl_container').width();
            var innerH = $('#webgl_container').height();
            self.setSize( innerW, innerH );
        }

        this.init = function(_targetId){

            currentScene = param.model;
            self.dom = document.getElementById( _targetId);
            self.setEventListener();
            self.setScene();
            self.load();
            if(isDebugMode){
                self.customParam();
            }
        };

        this.setScene = function () {
            scene = new THREE.Scene();
            //scene.background = new THREE.Color( 0x000000);

            renderer = new THREE.WebGLRenderer({ antialias: false});
            renderer.sortObjects = false;

            resizeFunc();

            self.setCamera();

            this.dom.appendChild( renderer.domElement);
        };

        this.setCamera = function(){
            var cameraData = OBJ_DATA[currentScene].camera;
            camera = new THREE.PerspectiveCamera(  param.cameraFov, self.width /  self.height, 1, 10000 );
            camera.position.set( cameraData.pos.x, cameraData.pos.y, cameraData.pos.z);
            camera.lookAt( scene.position );
            camera.fov = param.cameraFov;
            camera.updateProjectionMatrix();

            //control 생성
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enabled = param.camera_control;
            controls.update();
        };

        this.load = function () {
            var cameraData = OBJ_DATA[currentScene].camera;
            TweenMax.to(camera.position, 0,{x:cameraData.pos.x,y:cameraData.pos.y, z:cameraData.pos.z, overwrite:true});

            isLoadStart = true;
            //$('#MAIN .loading').addClass('on');

            if(fog){fog = null;}
            if(cloud){cloud = null;}
            if(airP){airP = [];}
            if(birdGrp){birdGrp = [];}
            if(birdLtArr){birdLtArr= [];}
            if(birdRtArr){birdRtArr= [];}

            var objUrl = path + currentScene+'.fbx';
            var textureMap = OBJ_TEXTURE[currentScene].texture;

            var manager = new THREE.LoadingManager();
            manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
                //console.log( 'Started loading file: ' + url + ' Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
            };

            manager.onProgress = function( xhr ) {
                if ( xhr.lengthComputable ) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
                }
            };

            manager.onError = function( xhr ) {
                console.error( xhr );
            };

            manager.onLoad = function ( ) {
                //console.log('manager onLoad');
                loadComplete();
            };

            var textureLoader = new THREE.TextureLoader(manager);
            for(var i=0; i < textureMap.length; i++){
                (function(tl, i){
                    var url =path+ 'texture/' +currentScene+'/'+ tl;
                    textureLoader.load(url, function(tex){
                        var id = textureMap[i].substring(0, textureMap[i].length - 4);
                        textureObj[id] = tex;
                    });
                })(textureMap[i], i);
            }

            var fbxLoader = new THREE.FBXLoader(manager);
            fbxLoader.load(objUrl, function ( _object ) {
                OBJ = _object;
                //},  function(e){console.log('fbx onProgress' ,e)}, function(e){console.log('fbx onError', e)});
            });
        };

        function loadComplete(){
            while(scene.children.length > 0){
                scene.remove(scene.children[0]);
            }

            isLoadStart = false;

            if (currentScene == 'aircraft') {
                currentSceneIdx = 1;
                self.makeCloud();
                param.cameraFov = 30;
            } else if (currentScene == 'cave') {
                currentSceneIdx = 2;
                self.makeFlare();
                param.cameraFov = 44;
            }else if(currentScene =='soldier'){
                currentSceneIdx = 0;
                self.makeFog();
                param.cameraFov = 40;
            }
            camera.fov = param.cameraFov;
            camera.updateProjectionMatrix();

            setModel(OBJ);
        }

        function setModel(_object){
            //console.log('_object ' ,_object)
            _object.traverse( function ( sceneChild ) {
                if ( sceneChild.type === "Mesh" ) {
                    var objName = sceneChild.name;
                    var objData =  OBJ_DATA[currentScene].material[objName];
                    //console.log('aaa' ,  objName,  sceneChild);
                    if(objData !== undefined){
                        sceneChild.material = new THREE.MeshBasicMaterial( { color: 0xffffff});
                        if(objData.map){
                            //console.log('@@@@map', objName, textureObj[objData.map])
                            sceneChild.material.map = textureObj[objData.map];
                            if(objData.map == 'clouds'){
                                sceneChild.material.visible = false;
                            }
                        }
                        if(objData.env){
                            //console.log('@@@@env', objName)
                            sceneChild.material.envMap = textureObj[objData.env];
                            sceneChild.material.envMap.mapping = THREE.SphericalReflectionMapping;
                            sceneChild.material.reflectivity = 1.;
                        }
                        if(objData.alpha){
                            //console.log('@@@@alpha', objName)
                            sceneChild.material.alphaMap = textureObj[objData.alpha];
                        }
                        if(objData.blending){
                            //console.log('@@@@blending', objName)
                            sceneChild.material.blending  = THREE[objData.blending];
                        }
                        if(objData.color){
                            //console.log('@@@@color', objName)
                            sceneChild.material.color.set(objData.blending);
                        }

                        if(objData.transparent){
                            sceneChild.material.transparent = true;
                        }

                        if(objData.alphaTest){
                            sceneChild.material.alphaTest = objData.alphaTest;
                        }
                        if(objData.depthTest){
                            sceneChild.material.depthTest = true;
                            //sceneChild.material.depthWrite = false;
                        }
                        if(objData.depthWrite){
                            //sceneChild.material.depthTest = true;
                            sceneChild.material.depthWrite = objData.depthWrite;
                        }
                        if(objData.side){
                            sceneChild.material.side = THREE[objData.side];
                        }
                        if(objData.opacity){
                            sceneChild.material.opacity = objData.opacity;
                        }

                        if(objName == 'propeller_L01' || objName == 'propeller_L02' || objName == 'propeller_R01' || objName == 'propeller_R02'){
                            airP.push(sceneChild);
                        }

                        if(objName == 'bird_winglt' && currentScene == 'soldier'){
                            birdLtArr.push(sceneChild);
                        }

                        if(objName == 'bird_wingrt' && currentScene == 'soldier'){
                            birdRtArr.push(sceneChild);
                        }

                        if(objName == 'light' && currentScene == 'cave'){
                            caveLight = sceneChild.material;
                        }

                        if(objName == 'light2' && currentScene == 'cave'){
                            caveLight2 = sceneChild.material;
                        }

                        sceneChild.material.needsUpdate = true;
                    }
                }else if( sceneChild.type === "Group" ) {

                    var objName = sceneChild.name;
                    if(objName.indexOf('bird_grp') > -1){
                        birdGrp.push(sceneChild);
                    }
                }
            });

            scene.add(OBJ);

            activeClass();

            TweenMax.fromTo(camera, 1.2, {fov:param.cameraFov},{fov:OBJ_DATA[currentScene].camera.fov,onUpdate:function(){
                camera.updateProjectionMatrix();
                //param.cameraFov = camera.fov ;
            },onComplete:function(){
                isMouseInteraction = true;
                try{
                    SanhokMain.webglCallRolling();
                }catch (e){}
            }});

            isFirstIn = false;
            isLoadComplete = true;
            self.play();
        }

        function activeClass(){
            $('#MAIN .loading').removeClass('on');
            $('#MAIN .title_container .title_inner').addClass('active');

            $('.title_container .carousel a').removeClass('active');
            $('.title_container .carousel a:eq('+currentSceneIdx+')').addClass('active');
        }

        this.makeFlare =function(){
            var textureLoader = new THREE.TextureLoader();
            var textureFlare0 = textureLoader.load( path+"texture/flare_sub1.png" );
            var textureFlare1 = textureLoader.load( path+"texture/flare_sub2.png" );

            lensflare = new THREE.Lensflare();

            lensflare.addElement( new THREE.LensflareElement( textureFlare0, 900, 0.4) );
            lensflare.addElement( new THREE.LensflareElement( textureFlare1, 1800, 0.6 ) );
            lensflare.material.transparent = true;
            lensflare.material.needsUpdate = true;

            lensflare.position.set(-33, 60, -45.5)
            scene.add(lensflare);

            var tempVar = {opacity:1};
            flareTween = TweenMax.to(tempVar, 2, {opacity: 0.9, ease:RoughEase.ease.config({strength: 32, points:5,randomize: true}), repeat:-1, yoyo:true, onUpdate:function(){
                lensflare.updateOpacity(tempVar.opacity);
            }});

        };

        this.makeFog = function(){
            var geometry = new THREE.Geometry();
            var cloudTexture = new THREE.TextureLoader().load(path+'texture/clouds.png');
            cloudTexture.magFilter = THREE.LinearFilter;
            cloudTexture.minFilter = THREE.LinearFilter;
            var meshMaterial = new THREE.MeshBasicMaterial({
                map: cloudTexture,
                depthWrite:false,
                transparent:true,
                opacity:0.5,
            });

            var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 32));
            for (var i = 0; i < 8; i++) {
                planeMesh.position.x = THREE.Math.randFloat(-10, 150);
                planeMesh.position.y = THREE.Math.randFloatSpread(40);
                planeMesh.position.z =  THREE.Math.randFloat(-25, -18);
                planeMesh.rotation.z = Math.random() * Math.PI;
                planeMesh.scale.x = planeMesh.scale.y = THREE.Math.randFloat(0.6,1.0);
                planeMesh.updateMatrix();
                geometry.merge(planeMesh.geometry, planeMesh.matrix);
            }
            var mesh = new THREE.Mesh(geometry, meshMaterial);
            scene.add(mesh);
            fog = mesh;
        }

        this.makeCloud = function(){
            var geometry = new THREE.Geometry();
            var cloudTexture = new THREE.TextureLoader().load(path+'texture/clouds.png');
            cloudTexture.magFilter = THREE.LinearFilter;
            cloudTexture.minFilter = THREE.LinearFilter;
            var meshMaterial = new THREE.MeshBasicMaterial({
                map: cloudTexture,
                depthWrite:false,
                transparent:true,
                opacity:0.4,
            });

            var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 32));
            for (var i = 0; i < 100; i++) {
                planeMesh.position.x = THREE.Math.randFloat(-100, 800);
                planeMesh.position.y = THREE.Math.randFloatSpread(500);
                planeMesh.position.z =  THREE.Math.randFloat(-25, -18);
                planeMesh.rotation.z = Math.random() * Math.PI;
                planeMesh.scale.x = planeMesh.scale.y = THREE.Math.randFloat(0.3,1.5);
                planeMesh.updateMatrix();
                geometry.merge(planeMesh.geometry, planeMesh.matrix);
            }
            var mesh = new THREE.Mesh(geometry, meshMaterial);
            scene.add(mesh);
            cloud = mesh;
        }

        this.setEventListener = function(){
            window.addEventListener( 'resize',  resizeFunc);
            window.addEventListener("deviceorientation", onDeviceOrientation);
            document.addEventListener( 'mousemove', onDocumentMouseMove);
            document.addEventListener("visibilitychange", function() {
                //console.log(' document.visibilityState' , document.visibilityState)
                if( document.visibilityState  == 'visible'){
                    if(isRender){
                        self.play();
                    }
                }
            });
        };

        this.setSize = function (width, height) {
            self.width = width;
            self.height = height;

            tempSize.w = (window.innerWidth -width)/ 2;
            tempSize.h = (window.innerWidth-height)/ 2;

            if(width < minSize.w){
                self.width = minSize.w
            }
            if(height < minSize.h){
                self.height = minSize.h;
            }

            windowHalfX = self.width / 2;
            windowHalfY =  self.height  / 2;

            //windowHalfX = window.innerWidth/ 2;
            //windowHalfY = window.innerHeight/ 2;

            if (camera) {
                camera.aspect = self.width /  self.height ;
                camera.updateProjectionMatrix();
            }

            if (renderer) {
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(self.width,  self.height );
            }
        };


        function onDocumentMouseMove( e ) {
            if(isMobile.any()){return;}
            isMouseMove = true;
            mouseX = (  e.clientX - windowHalfX - tempSize.w) / windowHalfX ;
            mouseY = -(  e.clientY - windowHalfY) / windowHalfY ;
            if(mouseTimeout !== undefined){
                window.clearTimeout(mouseTimeout);
            }
            mouseTimeout = window.setTimeout(function(){
                isMouseMove = false;
                lastMousePos.x = camera.position.x;
                lastMousePos.y = camera.position.y;
            }, 400);
        }

        function onDeviceOrientation(e){
            mouseX = (e.gamma ? e.gamma * (Math.PI / 180) : 0) * -4;
            mouseY =  (e.beta ?  (e.beta-45) * (Math.PI / 180): 0) * -4;
            mouseX = Math.min(mouseX , 1.3);
            mouseY = Math.min(mouseY , 1.3);
            mouseX = Math.max(mouseX , -1.3);
            mouseY = Math.max(mouseY , -1.3);
            //console.log('mouseX' , mouseX, mouseY );
        }

        function animate() {
            if(!isRender){isRender = true;}
            request = requestAnimationFrame(animate);
            render();
        }

        var threeClock = new THREE.Clock();
        var clock = 0;
        function render(){
            //console.log('render')
            if(controls){
                controls.update();
            }

            if(stats){
                stats.update();
            }


            if(airP.length > 1){
                for(var i=0; i<airP.length;i++){
                    airP[i].rotation.z += 0.02;
                }
            }

            if(cloud){
                if(cloud.position.x < -500){
                    cloud.position.x = 100;
                    cloud.position.y = 100;
                }
                cloud.position.x -= 0.1;
                cloud.position.y -= 0.05;
            }

            if(fog){
                if(fog.position.x < -400){
                    fog.position.x = 100;
                }
                fog.position.x -= 0.02;
            }


            if(birdLtArr.length > 1){
                clock+=0.04;
                for(var i=0; i< birdLtArr.length;i++){
                    birdLtArr[i].rotation.x = Math.sin(clock) * THREE.Math.degToRad(30);
                    birdRtArr[i].rotation.x = Math.sin(clock) * THREE.Math.degToRad(-30);
                }

                birdGrp[0].rotation.y +=0.002;
            }

            if(!param.camera_control && OBJ){
                var cameraPos = OBJ_DATA[currentScene].camera.pos;
                var cameraLimit = OBJ_DATA[currentScene].camera.limit;

                /*if(!isMouseMove && isMouseInteraction){
                 console.log('mouseY', mouseX);
                 }*/

                var tarX = (cameraPos.x +(cameraLimit.x* mouseX)) *param.mouseDepth;
                var tarY = (cameraPos.y + (cameraLimit.y* mouseY)) *param.mouseDepth;

                //console.log('@isMouseMove'  , cameraTweenSpeed);
                TweenMax.to(camera.position, cameraTweenSpeed ,{x:tarX,y:tarY});

            }
            renderer.render( scene, camera );
        };


        this.play = function () {
            if(request){
                cancelAnimationFrame(request);
            }
            request = requestAnimationFrame(animate);
        };

        this.stop = function () {
            cancelAnimationFrame(request);
            isRender = false;
        };

        this.dispose = function () {
            if(!this.dom){return;}
            while (this.dom.children.length) {
                this.dom.removeChild(this.dom.firstChild);
            }

            this.stop();
            camera = undefined;
            scene = undefined;

            if(renderer){
                renderer.dispose();
                renderer = undefined;
            }
        };

        this.getCamera = function(){
            return camera;
        }

        this.getLoadingStatus = function(){
            return isLoadComplete;
        }
    }
};


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var btg = new BTG.App();
btg.init('webgl_container');



