const platformSRC = './assets/images/platform.png';
const tallPlatform = './assets/images/platformSmallTall.png';
const hills = './assets/images/hills.png';
const bg = './assets/images/background.png';

const platformImage = new Image();
platformImage.src= platformSRC


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

class Player {
    constructor(){
        this.positon = { 
            x:100, 
            y:100
        }
        this.width = 30
        this.height = 30
        this.velocity = {
            x: 0,
            y: 0
        }
        this.lastKey
    }

    draw(){
        c.fillStyle = 'red';
        c.fillRect(this.positon.x, this.positon.y, this.width, this.height);
        
    }

    update(){
        this.positon.y += this.velocity.y;
        this.positon.x += this.velocity.x;
        this.velocity.y += gravity;

        // if(this.positon.y + this.height + this.velocity.y >= canvas.height){
        //     this.velocity.y += 0;
        // } else {
        //     this.velocity.y += gravity;
        // }
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

const sceen = [
    new Scenery({positon:{x: 0, y: 0 }, imageSRC: bg }),
    new Scenery({positon:{x: -1, y: -1 }, imageSRC: hills }),
] 

const player = new Player();

const platforms = [
    new Platform({positon:{x: 0, y: 450 }, imageSRC: platformSRC }),
    new Platform({positon:{x: platformImage.width + 100, y: 450 }, imageSRC: platformSRC }),
    new Platform({positon:{x: (platformImage.width * 2) + 300, y: 450 }, imageSRC: platformSRC }),
    new Platform({positon:{x: (platformImage.width * 3) + 600, y: 450 }, imageSRC: platformSRC }),
];


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
        if (keys.d.pressed){
            platform.positon.x -= 5;
            sceen.forEach((scBG)=>{
                scBG.positon.x -= 1;
            })
        
            scrollOffset++;  
        } else if (keys.a.pressed){
            platform.positon.x += 5;
            sceen.forEach((scBG)=>{
                scBG.positon.x += 1;
            })
            scrollOffset--; 
        }
    });

    platforms.forEach(platform =>{
        if(
            player.positon.y + player.height <= platform.positon.y &&
            player.positon.y + player.height + player.velocity.y >= platform.positon.y &&
            player.positon.x + player.width >= platform.positon.x &&
            player.positon.x <= platform.positon.x + platform.width
        ){
            player.velocity.y = 0;
        }
    });

    sceen.forEach((scBG)=>{
        // console.log(scBG);
        scBG.draw();
    })

    platforms.forEach(platform =>{
        platform.draw();
    });
    
    player.update();

    if(scrollOffset >= 2000){
        console.log('You Win!');
    }

}



addEventListener('keydown', ({key})=>{
    switch (key) {
        case "a":
            keys.a.pressed = true;
            player.lastKey = "left";
            break;
        case "d":
            keys.d.pressed = true;
            player.lastKey = "right";
            break;
        case "w":
            if(!keys.w.pressed){
                player.velocity.y -= 20;
            } else {
                player.velocity.y += 0;  
            }
            keys.w.pressed = true
            break;
    
        default:
            break;
    }
});

addEventListener('keyup', ({key})=>{
    switch (key) {
        case "a":
            keys.a.pressed = false;
            break;
        case "d":
            keys.d.pressed = false;
            break;
        case "w":
            player.velocity.y = 0;
            keys.w.pressed = false;
            break;
    
        default:
            break;
    }
});

animate();