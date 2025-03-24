let game = document.querySelector(".game");
let home = document.querySelector(".home");
let play = document.querySelector(".play");
let user = document.querySelector('input[name="user"]');
let instruction = document.querySelector(".instruction");
let instructionCon = document.querySelector(".instruction-con");
let close = document.querySelector(".close");
let levels = document.querySelector('select[name="level"]');
let img = document.querySelector("img");
let player = document.querySelector(".player");
let grass = document.querySelectorAll(".grass");
let garden = document.querySelector(".garden");
let gardenRow = document.querySelectorAll(".garden-row");
let sun = document.querySelector(".sun");
let score = document.querySelector(".score");
let time = document.querySelector(".time");
let historyCon = document.querySelector(".history-con");

// let zombie = document.querySelector(".zombie");
// let pea = document.querySelector(".pea");

let peashooter = document.querySelector(".peashooter-seeds");
let iceshooter = document.querySelector(".icepeashooter-seeds");
let wallnut = document.querySelector(".wallnut-seeds");
let sunflower = document.querySelector(".sunflower-seeds");
let shovel = document.querySelector(".shovel");

let timeVal = 300;
let point = 0;
let money = 1000;
let selected = "";
let level = "";
let username;

let zombieInterval;
let peaInterval;
let spawn;

play.addEventListener("click", (e) => {
    e.preventDefault();
    home.style.display = "none";
    game.style.display = "flex";
    instructionCon.style.display = "none";
    username = user.value;

    player.innerHTML = username;
    sun.textContent = money;

    start();
});

function start() {
    let min = 4;
    let sec = 59;
    let timeInterval = setInterval(() => {
        time.textContent = `Time : ${String(min).padStart(2, "0")}:${String(
            sec
        ).padStart(2, "0")}`;

        if (sec == 0) {
            sec = 59;
            min--;
        } else {
            sec--;
        }

        if (min == 0 && sec == 0) {
            savePoint();
        }
    }, 1000);
    score.textContent = `Score : ${point}`;
    let zombieCount = {
        easy: 1,
        medium: 2,
        hard: 3,
    }[level];

    showLb();
    setTimeout(() => {
        spawn = setInterval(() => {
            for (let index = 0; index < zombieCount; index++) {
                spawnZombie();
            }
        }, 5000);
    }, 0);
}

function savePoint() {
    let lb = JSON.parse(localStorage.getItem("lb")) || [];
    lb.push({ name: username, point: point, level: level });
    localStorage.setItem("lb", JSON.stringify(lb));
}

function showLb(sort = "score") {
    let lb = JSON.parse(localStorage.getItem("lb")) || [];

    if (sort == "score") {
        lb.sort((a, b) => b.score - a.score);
    } else {
        lb.sort((a, b) => a.time - b.time);
    }

    historyCon.innerHTML = "";

    lb.forEach((l) => {
        let history = document.createElement("div");
        history.classList.add("history");

        history.innerHTML = `
            <div class="history-text">
                <h3>${l.name}</h3>
                <p>Score : ${l.point}</p>
            </div>
            <div class="history-btn">Detail</div>
        `;
        historyCon.appendChild(history);
    });
}

function spawnZombie() {
    let health = 100;
    let damageInterval;
    let zombie = document.createElement("img");
    zombie.frameZombie = 0;
    zombie.xZombie = 0;
    zombie.status = "none";

    zombie.classList.add("zombie");
    zombie.src = `./Sprites/Zombie/frame_00_delay-0.05s.gif`;
    garden.appendChild(zombie);

    let x = garden.clientWidth + 100;
    let y =
        (garden.clientHeight / 5) * Math.max(1, Math.round(Math.random() * 5)) -
        145;

    zombie.style.left = x + "px";
    zombie.style.top = y + "px";

    let zombieInterval = setInterval(
        () => {
            zombie.src = `./Sprites/Zombie/frame_${String(
                zombie.frameZombie
            ).padStart(2, "0")}_delay-0.05s.gif`;

            zombie.xZombie += 0.8;
            zombie.style.left = x - zombie.xZombie + "px";

            zombie.frameZombie = (zombie.frameZombie + 1) % 33;
        },
        zombie.status == "none" ? 50 : 200
    );

    

    damageInterval = setInterval(() => {
        let pea = document.querySelectorAll(".pea");
        let icepea = document.querySelectorAll(".icepea");

        pea.forEach((p) => {
            let rectP = p.getBoundingClientRect();
            let rectZ = zombie.getBoundingClientRect();

            if (
                rectP.right > rectZ.left + 20 &&
                rectP.left < rectZ.right &&
                rectP.bottom > rectZ.top &&
                rectP.top < rectZ.bottom
            ) {
                p.remove();
                health -= 20;

                if (health <= 0) {
                    clearInterval(damageInterval);
                    clearInterval(zombieInterval);
                    point += 100;
                    score.textContent = `Score : ${point}`;

                    zombie.remove();
                }
            }
        });

        icepea.forEach((i) => {
            let rectI = i.getBoundingClientRect();
            let rectZ = zombie.getBoundingClientRect();

            if (
                rectI.right > rectZ.left + 20 &&
                rectI.left < rectZ.right &&
                rectI.bottom > rectZ.top &&
                rectI.top < rectZ.bottom
            ) {
                i.remove();
                health -= 20;

                zombie.style.filter = "hue-rotate(180deg) brightness(0.8)";
                clearInterval(zombieInterval);

                zombie.status = "slow";
                zombieInterval = setInterval(() => {
                    zombie.src = `./Sprites/Zombie/frame_${String(
                        zombie.frameZombie
                    ).padStart(2, "0")}_delay-0.05s.gif`;

                    zombie.xZombie += 0.4;
                    zombie.style.left = x - zombie.xZombie + "px";

                    zombie.frameZombie = (zombie.frameZombie + 1) % 33;
                }, 200);

                setTimeout(() => {
                    if (health > 0) {
                        clearInterval(zombieInterval);
                        zombie.status = "none";
                        zombieInterval = setInterval(() => {
                            zombie.src = `./Sprites/Zombie/frame_${String(
                                zombie.frameZombie
                            ).padStart(2, "0")}_delay-0.05s.gif`;

                            zombie.xZombie += 0.8;
                            zombie.style.left = x - zombie.xZombie + "px";

                            zombie.frameZombie = (zombie.frameZombie + 1) % 33;
                        }, 50);
                        zombie.style.filter = "";
                        console.log("balik lagi");
                    }
                }, 5000);

                if (health <= 0) {
                    clearInterval(zombieInterval);
                    clearInterval(damageInterval);
                    point += 100;
                    score.textContent = `Score : ${point}`;
                    zombie.remove();
                }
            }
        });
    }, 16);

    // Ini Check Collision nya, apakah sudah benar kak?

    // gardenRow.forEach((gr) => {
    //     let checkCollision = setInterval(() => {
    //         let grs = gr.querySelector("img");
    //         if (!grs) return;

    //         let rectP = grs.getBoundingClientRect();
    //         let rectZ = zombie.getBoundingClientRect();

    //         if (
    //             rectP.right > rectZ.left &&
    //             rectP.left < rectZ.right &&
    //             rectP.bottom > rectZ.top &&
    //             rectP.top < rectZ.bottom
    //         ) {
    //             console.log("ini kena");

    //             clearInterval(checkCollision);
    //             clearInterval(zombieInterval);

    //             zombieInterval = setInterval(
    //                 () => {
    //                     zombie.src = `./Sprites/Zombie/frame_${String(
    //                         zombie.frameZombie
    //                     ).padStart(2, "0")}_delay-0.05s.gif`;
    //                     zombie.style.left = x + "px";
            
    //                     zombie.frameZombie = (zombie.frameZombie + 1) % 33;
    //                 },
    //                 zombie.status == "none" ? 50 : 200
    //             );
                
                
    //         }
    //     }, 16);
    // });
}

peashooter.addEventListener("click", (e) => {
    if (selected == "PeaShooter") {
        selected = "";
        return;
    }
    selected = "PeaShooter";
});
iceshooter.addEventListener("click", (e) => {
    if (selected == "IcePea") {
        selected = "";
        return;
    }
    selected = "IcePea";
});
wallnut.addEventListener("click", (e) => {
    if (selected == "WallNut") {
        selected = "";
        return;
    }
    selected = "WallNut";
});
sunflower.addEventListener("click", (e) => {
    if (selected == "SunFlower") {
        selected = "";
        return;
    }
    selected = "SunFlower";
});
shovel.addEventListener("click", (e) => {
    if (selected == "shovel") {
        selected = "";
        return;
    }
    selected = "shovel";
});
gardenRow.forEach((gr) => {
    let grs = gr.querySelector("img");
    grs.dataset.hasPlant = "false";
    grs.addEventListener("mouseover", () => {
        if (selected == "shovel") {
            let div = document.createElement("div");
            div.classList.add("red");
            gr.appendChild(div);
            console.log("red ditambah");
            return;
        }
        if (grs.dataset.hasPlant == "true" || selected == "shovel") return;
        if (selected == "") {
            grs.src = `./Sprites/General/Grass.bmp`;
            grs.style.opacity = 1;
        } else if (selected == "SunFlower") {
            grs.src = `./Sprites/${selected}/frame_00_delay-0.06s.gif`;
            grs.style.opacity = 0.6;
        } else {
            grs.src = `./Sprites/${selected}/frame_10_delay-0.12s.gif`;
            grs.style.opacity = 0.6;
        }
    });
    gr.addEventListener("click", () => {
        if (selected == "shovel") {
            console.log("Menghapus tanaman...");

            if (gr.plantInterval) {
                clearInterval(gr.plantInterval);
                clearInterval(gr.delayInterval);

                console.log("Interval dihapus");
            }

            grs.dataset.hasPlant = "false";

            return;
        }

        if (selected == "" || selected == "shovel") return;

        let plant = selected;
        let price = {
            PeaShooter: 100,
            IcePea: 175,
            WallNut: 50,
            SunFlower: 50,
        }[plant];

        if (grs.dataset.hasPlant == "true" || money < price) return;

        let frame = plant == "IcePea" ? 2 : 0;
        let maxFrame = {
            PeaShooter: 30,
            IcePea: 31,
            SunFlower: 24,
            WallNut: 32,
        }[plant];

        let intervalSpeed = plant == "SunFlower" ? 60 : 120;

        grs.health = 100;

        gr.plantInterval = setInterval(() => {
            grs.src = `./Sprites/${plant}/frame_${String(frame).padStart(
                2,
                "0"
            )}_delay-${
                plant == "SunFlower"
                    ? "0.06"
                    : plant == "WallNut" && frame == 32
                    ? "1"
                    : "0.12"
            }s.gif`;
            frame =
                frame >= maxFrame
                    ? plant == "IcePea"
                        ? 2
                        : 0
                    : plant == "SunFlower" && frame == 0
                    ? frame + 2
                    : frame + 1;
        }, intervalSpeed);

        if (plant == "WallNut" && frame == 31) {
            intervalSpeed = 1000;
        }

        money -= price;
        grs.setAttribute("data-has-plant", "true");
        sun.innerHTML = money;

        let health = 0;

        if (plant == "PeaShooter" || plant == "IcePea") {
            gr.delayInterval = setInterval(() => {
                let zombies = document.querySelectorAll(".zombie");
                let plantRect = gr.getBoundingClientRect();

                let zombieDetected = Array.from(zombies).some((zombie) => {
                    let zombieRect = zombie.getBoundingClientRect();
                    return (
                        zombieRect.top + 100 < plantRect.bottom &&
                        zombieRect.bottom > plantRect.top
                    );
                });

                if (zombieDetected) {
                    let img = document.createElement("img");
                    let shootInterval;
                    img.src =
                        plant == "PeaShooter"
                            ? "./Sprites/General/Pea.png"
                            : "./Sprites/General/IcePea.png";
                    img.classList.add(plant == "PeaShooter" ? "pea" : "icepea");

                    let x = 90;

                    gr.appendChild(img);
                    shootInterval = setInterval(() => {
                        img.style.left = `${x}px`;
                        x += 5;
                        if (x >= 1000) {
                            clearInterval(shootInterval);
                            if (gr.contains(img)) {
                                gr.removeChild(img);
                            }
                        }
                    }, 16);
                }
            }, 3500);
        } else if (plant == "SunFlower") {
            gr.delayInterval = setInterval(() => {
                let img = document.createElement("img");
                let shootInterval;
                img.src = "./Sprites/General/Sun.png";
                img.classList.add("sun");
                let x = Math.random() * 80 + 0;
                let y = 0;

                img.style.left = `${x}px`;

                img.addEventListener("click", () => {
                    money += 50;
                    sun.textContent = money;
                    gr.removeChild(img);
                });

                gr.appendChild(img);
                shootInterval = setInterval(() => {
                    img.style.top = `${y}px`;
                    y += 1;
                    if (y == 50) {
                        clearInterval(shootInterval);
                    }
                }, 16);
                setTimeout(() => {
                    gr.removeChild(img);
                }, 12000);
            }, 10000);
        }

        // gr.damageInterval = setInterval(() => {
        //     let zombies = document.querySelectorAll(".zombie");

        //     zombies.forEach((z)=>{
        //         let rectZ = z.getBoundingClientRect();
        //         let rectP = gr.getBoundingClientRect();

        //         if (
        //             rectZ.right > rectP.left &&
        //             rectP.right > rectZ.left &&
        //             rectP.bottom > rectZ.top &&
        //             rectZ.bottom > rectP.top
        //         ) {
        //             console.log("test")
        //             z.zombieInterval = setInterval(
        //                 () => {
        //                     z.src = `./Sprites/Zombie/frame_${String(
        //                         zombie.frameZombie
        //                     ).padStart(2, "0")}_delay-0.05s.gif`;

        //                     z.xZombie += 0;
        //                     z.style.left = x - z.xZombie + "px";

        //                     z.frameZombie = (z.frameZombie + 1) % 33;
        //                 },
        //                 200
        //             );
        //         } else {
        //             z.zombieInterval = setInterval(
        //                 () => {
        //                     z.src = `./Sprites/Zombie/frame_${String(
        //                         z.frameZombie
        //                     ).padStart(2, "0")}_delay-0.05s.gif`;

        //                     z.xZombie += 0.8;
        //                     z.style.left = x - z.xZombie + "px";

        //                     z.frameZombie = (z.frameZombie + 1) % 33;
        //                 },
        //                 200
        //             );
        //         }
        //     })
        // }, 16);
    });

    gr.addEventListener("mouseleave", () => {
        if (selected == "shovel") {
            grs.style.opacity = 1;
            let redOverlay = gr.querySelector(".red");
            if (redOverlay) gr.removeChild(redOverlay);
            grs.src = `./Sprites/General/Grass.bmp`;

            return;
        }
        if (grs.dataset.hasPlant == "true") {
            grs.style.opacity = 1;

            return;
        }
        grs.src = `./Sprites/General/Grass.bmp`;
        grs.style.opacity = 1;
    });
});

close.addEventListener("click", (e) => {
    e.preventDefault();
    instructionCon.style.display = "none";
});

instruction.addEventListener("click", (e) => {
    e.preventDefault();
    instructionCon.style.display = "block";
});

user.addEventListener("input", () => {
    play.classList.toggle("disabled", !user.value || !level);
    play.disabled = !user.value || !level;
});

levels.addEventListener("change", () => {
    level = levels.value;
    play.classList.toggle("disabled", !user.value || !level);
    play.disabled = !user.value || !level;
});
