class Player {
    constructor(){
        this.positon = { 
            x:100, 
            y:100
        }
        this.width = 66
        this.height = 150
        this.velocity = {
            x: 0,
            y: 0
        }
        this.lastKey
        this.playerSpeed = 5
        this.image = createImage(spriteStandRight);
        this.frames = 0
        this.sprites = {
            stand:{
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw(){
        c.drawImage(
            this.currentSprite, 
            this.currentCropWidth * this.frames, 
            0, 
            this.currentCropWidth, 
            this.image.height, 
            this.positon.x, 
            this.positon.y, 
            this.width, 
            this.height);
    }

    update(){
        this.frames++;
        if(this.frames > 59 && 
            this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left){
            this.frames = 0
        } else if(this.frames > 29 && this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left){
            this.frames = 0
        }
        this.positon.y += this.velocity.y;
        this.positon.x += this.velocity.x;
        this.velocity.y += gravity;
        this.draw();
    }
}

class Platform {
    constructor({positon, imageSRC}){
        this.image = new Image(),
        this.image.src = imageSRC;
        this.positon = { 
            x: positon.x, 
            y: positon.y
        }
        this.width = this.image.width;
        this.height = this.image.height;
    }

    draw(){
        c.drawImage(
            this.image, this.positon.x, this.positon.y, this.width, this.height
        )
    }
}

class Scenery {
    constructor({positon, imageSRC}){
        this.image = new Image(),
        this.image.src = imageSRC;
        this.positon = { 
            x: positon.x, 
            y: positon.y
        }
        this.width = this.image.width;
        this.height = this.image.height;
    }
    draw(){
        c.drawImage(
            this.image, this.positon.x, this.positon.y, this.width, this.height
        )
    }
}

// Background Sprites ref
const platformSRC = './assets/images/platform.png';
const tallPlatform = './assets/images/platformSmallTall.png';
const hills = './assets/images/hills.png';
const bg = './assets/images/background.png';

// Character Sprites ref
const spriteRunLeft = './assets/images/spriteRunLeft.png';
const spriteRunRight = './assets/images/spriteRunRight.png';
const spriteStandLeft = './assets/images/spriteStandLeft.png';
const spriteStandRight = './assets/images/spriteStandRight.png';

const platformImage = new Image();
platformImage.src= platformSRC;
const tallPlatformImge = new Image();
tallPlatformImge.src = tallPlatform;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.7;
const keys = {
    a: {pressed: false},
    d: {pressed: false},
    w: {pressed: false}
};

let scrollOffset = 0;

canvas.width = 1024;
canvas.height = 576;

let player;
let sceen = []; 
let platforms = [];

function createImage(imageSRC) {
    const img = new Image()
    img.src = imageSRC;
    return img;
}

function int() {
     sceen = [
        new Scenery({positon:{x: 0, y: 0 }, imageSRC: bg }),
        new Scenery({positon:{x: -1, y: -1 }, imageSRC: hills }),
    ] 
    
     player = new Player();
    
     platforms = [
        new Platform({positon:{x: (platformImage.width * 3) + 10, y: 250 }, imageSRC: tallPlatform }),
        new Platform({positon:{x: 0, y: 450 }, imageSRC: platformSRC }),
        new Platform({positon:{x: platformImage.width + 100, y: 450 }, imageSRC: platformSRC }),
        new Platform({positon:{x: (platformImage.width * 2) + 300, y: 450 }, imageSRC: platformSRC }),
        new Platform({positon:{x: (platformImage.width * 4)+ 100, y: 450 }, imageSRC: platformSRC })
    ];
    scrollOffset = 0; 
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0,0, canvas.width, canvas.height);
    
    // Player Movment
    player.velocity.x = 0;
    if ( 
        keys.a.pressed && 
        player.lastKey === "left" && 
        player.positon.x > 100
        ) {
        player.velocity.x = -5;
    } else if( 
        keys.d.pressed && 
        player.lastKey === "right" &&
        player.positon.x < 400 
        ){
        player.velocity.x = 5;
    }

    platforms.forEach(platform =>{
        if(
            player.positon.y + player.height <= platform.positon.y &&
            player.positon.y + player.height + player.velocity.y >= platform.positon.y &&
            player.positon.x + player.width >= platform.positon.x &&
            player.positon.x <= platform.positon.x + platform.width
        ){
            player.velocity.y = 0;
            keys.w.pressed = false;
        }

        if (keys.d.pressed){
            platform.positon.x -= player.playerSpeed;
            sceen.forEach((scBG)=>{
                scBG.positon.x -= player.playerSpeed * .05;
            })
        
            scrollOffset++;  
        } else if (keys.a.pressed && scrollOffset > 0){
            platform.positon.x += player.playerSpeed;
            sceen.forEach((scBG)=>{
                scBG.positon.x += player.playerSpeed * .05;
            })
            scrollOffset--; 
        }
    });

    sceen.forEach((scBG)=>{
        scBG.draw();
    })

    platforms.forEach(platform =>{
        platform.draw();
    });
    
    player.update();

    if(scrollOffset >= 2000){
        console.log('You Win!');
    }

    if(player.positon.y + player.height >= canvas.height){
        int();
    }

}
if(!keys.w.pressed){
    addEventListener('keydown', ({key})=>{
        switch (key) {
            case "a":
                keys.a.pressed = true;
                player.lastKey = "left";
                player.currentSprite = player.sprites.run.left;
                player.currentCropWidth = player.sprites.run.cropWidth;
                player.width = player.sprites.run.width;
                break;
            case "d":
                keys.d.pressed = true;
                player.lastKey = "right";
                player.currentSprite = player.sprites.run.right;
                player.currentCropWidth = player.sprites.run.cropWidth;
                player.width = player.sprites.run.width;
                break;
            case "w":
                if(!keys.w.pressed){
                    player.velocity.y -= 20;
                    keys.w.pressed = true
                } else {
                    player.velocity.y += 0;
                }
                break;
            default:
                break;
        }
    });

}
addEventListener('keyup', ({key})=>{
    switch (key) {
        case "a":
            keys.a.pressed = false;
            player.currentSprite = player.sprites.stand.left
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width;
            break;
        case "d":
            keys.d.pressed = false;
            player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width;
            break;
        case "w":
            player.velocity.y = 0;
            break;
    
        default:
            break;
    }
});



int();
animate();