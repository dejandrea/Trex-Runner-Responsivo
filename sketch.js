//cria as variaveis
var t_rex,t_rexRunning,t_rexCollided;
var canvas;
var ground, ground_img, invisibleGround;
var cloud, cloud_img,cloud_gp;
var cacto, cacto_img01,cacto_img02,cacto_img03,cacto_img04,cacto_img05,cacto_img06,cacto_gp;
var score = 0;
var record = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOver_img,restart,restart_img;
var die_song, jump_song, score_song;
var corvo,corvo_gp,corvo_img;


//carrega todas as mídias
function preload(){
   t_rexRunning = loadAnimation("trex3.png","trex4.png");
   t_rexCollided = loadAnimation("trex_collided.png");
   ground_img = loadImage("ground2.png");

   cloud_img = loadImage("cloud.png");

   cacto_img01 = loadImage("obstacle1.png");
   cacto_img02 = loadImage("obstacle2.png");
   cacto_img03 = loadImage("obstacle3.png");
   cacto_img04 = loadImage("obstacle4.png");
   cacto_img05 = loadImage("obstacle5.png");
   cacto_img06 = loadImage("obstacle6.png");

   gameOver_img = loadImage("gameOver.png");
   restart_img = loadImage("restart.png");

   corvo_img = loadImage("corvo.png");

   die_song = loadSound("die.mp3");
   score_song = loadSound("checkPoint.mp3");
   jump_song = loadSound("jump.mp3");


}

//configuração do jogo
function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    //600,200

    t_rex = createSprite(50,height-50,20,30);
    t_rex.addAnimation("run",t_rexRunning);
    t_rex.addAnimation("collided",t_rexCollided);
    t_rex.scale = 0.5;

    ground = createSprite(width/2,height-20,width,20);
    ground.addImage("solo", ground_img);
    

    invisibleGround = createSprite(width/2,height-10,width,10);
    invisibleGround.visible = false;

    cloud_gp = new Group();
    cacto_gp = new Group();
    corvo_gp = new Group();

    gameOver = createSprite(width/2,height-110,30,10);
    restart = createSprite(width/2,height-80,30,10);

    gameOver.addImage(gameOver_img);
    restart.addImage(restart_img);

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    gameOver.visible=false;
    restart.visible=false;

    //t_rex.debug = true;
    t_rex.setCollider("circle",0,0,30);

}


function draw(){
    background("white");

    if (t_rex.isTouching(cacto_gp)) {
        gameState = END;
        t_rex.changeAnimation("collided",t_rexCollided);
        //die_song.play();
    }

    //pontuação
    text("Score: "+score,width-100,height-180);
    //record
    //faça aqui o text para o record
    text("Record: "+record,width-180,height-180);


    if (gameState === PLAY) {
        //pulo do trex
        if (touches.lenght > 0 || keyDown("space") && t_rex.y >=height-50) {
            t_rex.velocityY = -10;
            jump_song.play();
            touches = [];
        }

        score = Math.round(frameCount/2);

        if (score >0 && score%100 === 0) {
            score_song.play();
        }


        //reiniciando o solo
        if(ground.x < 0){
            ground.x = ground.width/5;
        }

        ground.velocityX = -(2+score/100);

        spawnClouds();
        spawnObs();
        //spawnCorvos();

        /*if(score > 700 && score < 800){
            background("#1C1C1C");
        }*/

        /*
        var sortobs = Math.round(ramdom(1,2))
        switch (sortobs) {
            case 1:spawnCorvos();
                break;
            case 2:spawnObs();
                break;
        }*/

        
    }

    if (gameState === END) {
        //colocar aqui o que acontece quando o jogo pára.
        stopGame();
        if(score > record){
            record = score;
        }
    }
    gravity();
    console.log(gameState);
    
    //colisão do trex com o solo
    t_rex.collide(invisibleGround);

    if(mousePressedOver(restart)){
        console.log("reiniciou");
        resetGame();
    }
    

    drawSprites();
}

//funções

function gravity() {
    t_rex.velocityY = t_rex.velocityY+0.5;
}

function spawnClouds(){
    if(frameCount%90 === 0){
        cloud = createSprite(width,100,20,10);
        cloud.addImage(cloud_img);
        cloud.velocityX = -(2+score/100);
        cloud.y = random(height-180,height-100);
        cloud.scale = random(0.2,1)
        cloud.lifetime = width/cloud.velocityX;
        cloud.depth = t_rex.depth -1;
        cloud_gp.add(cloud);
    }
}

function spawnCorvos(){
    if(frameCount%150 === 0){
        corvo = createSprite(600,100,20,10);
        corvo.addImage(corvo_img);
        corvo.velocityX = -(2+score/100);
        corvo.y = random(100,120);
        corvo.scale = random(0.3)
        corvo.lifetime = 300;
        corvo.depth = t_rex.depth -1;
        corvo_gp.add(corvo);
    }
}

function spawnObs(){
    if(frameCount%120 === 0){
        cacto = createSprite(width,height-30,10,30);

        var sorteio = Math.round(random(1,6));
        switch (sorteio) {
            case 1: cacto.addImage(cacto_img01);
            cacto.scale = 0.4;
                break;
            case 2: cacto.addImage(cacto_img02);
            cacto.scale = 0.4;
                break;
            case 3: cacto.addImage(cacto_img03);
            cacto.scale = 0.4;
                break;
            case 4: cacto.addImage(cacto_img04);
            cacto.scale = 0.4;
                break;
            case 5: cacto.addImage(cacto_img05);
            cacto.scale = 0.4;
                break;
            case 6: cacto.addImage(cacto_img06);
            cacto.scale = 0.3;
                break;
        }
        cacto.velocityX = -(2+score/100);
        cacto.lifetime = width/cacto.velocityX;
        cacto.depth = t_rex.depth -1;
        cacto_gp.add(cacto);
    }
}

function stopGame(){
    cloud_gp.setVelocityXEach(0);
    cacto_gp.setVelocityXEach(0);
    cloud_gp.setLifetimeEach(-1);
    cacto_gp.setLifetimeEach(-1);
    ground.velocityX = 0;
    gameOver.visible=true;
    restart.visible=true;
}

function resetGame(){
    gameOver.visible = false;
    restart.visible = false;
    gameState = PLAY;
    cacto_gp.destroyEach();
    cloud_gp.destroyEach();
    score = 0;
    frameCount = 0;
    t_rex.changeAnimation("run",t_rexRunning);

}
