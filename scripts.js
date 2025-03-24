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
let main = document.querySelector(".main");
let grass = document.querySelectorAll(".grass");
let mower = document.querySelectorAll(".mower");
let garden = document.querySelector(".garden");
let gardenRow = document.querySelectorAll(".garden-row");
let sun = document.querySelector(".sun");
let score = document.querySelector(".score");
let time = document.querySelector(".time");
let historyCon = document.querySelector(".history-con");
let sortSelect = document.querySelector("#sort");

// let zombie = document.querySelector(".zombie");
// let pea = document.querySelector(".pea");

let peashooter = document.querySelector(".peashooter-seeds");
let iceshooter = document.querySelector(".icepeashooter-seeds");
let wallnut = document.querySelector(".wallnut-seeds");
let sunflower = document.querySelector(".sunflower-seeds");
let shovel = document.querySelector(".shovel");

let timeVal = 300;
let point = 0;
let money = 100;
let selected = "";
let level = "";
let username;
let over = false;

let peaInterval;
let timeInterval;
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
    timeInterval = setInterval(() => {
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
        if (over) return;
        spawn = setInterval(() => {
            for (let index = 0; index < zombieCount; index++) {
                spawnZombie();
            }
        }, 5000);
    }, 3000);

    let gameOverInterval = setInterval(() => {
        let zombie = document.querySelectorAll(".zombie");
        zombie.forEach((z) => {
            let rectZ = z.getBoundingClientRect();
            let rectM = main.getBoundingClientRect();

            if (rectZ.left < rectM.left) {
                let gameOvers = document.querySelector(".game-over");
                over = true;
                gameOvers.style.display = "flex";
                clearInterval(timeInterval);
                clearInterval(zombie.zombieInterval);
                gardenRow.forEach((gr) => {
                    let grs = gr.querySelector("img");
                    clearInterval(gr.plantInterval);
                    clearInterval(gr.delayInterval);
                    clearInterval(gr.shootInterval);
                    zombie.forEach((z) => {
                        clearInterval(z.zombieInterval);
                        clearInterval(z.damageInterval);
                        clearInterval(grs.shootInterval);
                    });
                    mower.forEach((m) => {
                        clearInterval(m.mowerInterval);
                    });
                    clearInterval(gameOverInterval);
                });
                savePoint();
                showLb();
            }
        });
    });
}
function savePoint() {
    let lb = JSON.parse(localStorage.getItem("lb")) || [];
    lb.push({ name: username, point: point, level: level, time: Date.now() });
    localStorage.setItem("lb", JSON.stringify(lb));
}

function showLb(sort = "score") {
    let lb = JSON.parse(localStorage.getItem("lb")) || [];

    if (sort == "score") {
        lb.sort((a, b) => b.point - a.point);
    } else {
        lb.sort((a, b) => b.time - a.time);
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
    if (over) return;
    let health = 100;
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

    zombie.zombieInterval = setInterval(
        () => {
            zombie.src = `./Sprites/Zombie/frame_${String(
                zombie.frameZombie
            ).padStart(2, "0")}_delay-0.05s.gif`;

            zombie.xZombie += 1;
            zombie.style.left = x - zombie.xZombie + "px";

            zombie.frameZombie = (zombie.frameZombie + 1) % 33;
        },
        zombie.status == "none" ? 50 : 200
    );

    zombie.damageInterval = setInterval(() => {
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
                    clearInterval(zombie.damageInterval);
                    clearInterval(zombie.zombieInterval);
                    point += 100;
                    score.textContent = `Score : ${point}`;

                    zombie.remove();
                    clearInterval(zombie.eatInterval);
                }
            }
        });

        icepea.forEach((i) => {
            let rectI = i.getBoundingClientRect();
            let rectZ = zombie.getBoundingClientRect();

            if (
                rectZ.right > rectI.left + 20 &&
                rectZ.left < rectI.right &&
                rectZ.bottom > rectI.top &&
                rectZ.top < rectI.bottom
            ) {
                i.remove();
                health -= 20;

                zombie.style.filter = "hue-rotate(180deg) brightness(0.8)";
                clearInterval(zombie.zombieInterval);

                zombie.status = "slow";
                zombie.zombieInterval = setInterval(() => {
                    zombie.src = `./Sprites/Zombie/frame_${String(
                        zombie.frameZombie
                    ).padStart(2, "0")}_delay-0.05s.gif`;

                    zombie.xZombie += 0.4;
                    zombie.style.left = x - zombie.xZombie + "px";

                    zombie.frameZombie = (zombie.frameZombie + 1) % 33;
                }, 200);

                setTimeout(() => {
                    if (health > 0) {
                        clearInterval(zombie.zombieInterval);
                        zombie.status = "none";
                        zombie.zombieInterval = setInterval(() => {
                            zombie.src = `./Sprites/Zombie/frame_${String(
                                zombie.frameZombie
                            ).padStart(2, "0")}_delay-0.05s.gif`;

                            zombie.xZombie += 1;
                            zombie.style.left = x - zombie.xZombie + "px";

                            zombie.frameZombie = (zombie.frameZombie + 1) % 33;
                        }, 50);
                        zombie.style.filter = "";
                        console.log("balik lagi");
                    }
                }, 5000);

                if (health <= 0) {
                    clearInterval(zombie.zombieInterval);
                    clearInterval(zombie.damageInterval);
                    point += 100;
                    score.textContent = `Score : ${point}`;
                    zombie.remove();
                    clearInterval(zombie.eatInterval);
                }
            }
        });
    }, 16);

    mower.forEach((m) => {
        if (!m.dataset.moving) {
            m.dataset.moving = "false";
        }
        let checkMower = setInterval(() => {
            let rectM = m.getBoundingClientRect();
            let rectZ = zombie.getBoundingClientRect();

            if (
                rectZ.right > rectM.left &&
                rectZ.left < rectM.right &&
                rectZ.bottom > rectM.top &&
                rectZ.top + 100 < rectM.bottom
            ) {
                let x = 0;

                m.src = `./Sprites/General/lawnmowerActivated.gif`;

                if (m.dataset.moving == "false") {
                    m.dataset.moving = "true";
                    m.mowerInterval = setInterval(() => {
                        m.style.left = x + "px";
                        x += 3;
                        if (x > 1500) {
                            clearInterval(checkMower);
                        }
                    }, 20);
                }

                clearInterval(zombie.damageInterval);
                clearInterval(zombie.zombieInterval);
                zombie.remove();
                clearInterval(zombie.eatInterval);
            }
        }, 16);
    });

    gardenRow.forEach((gr) => {
        let checkCollision = setInterval(() => {
            let grs = gr.querySelector('img[data-has-plant="true"]');
            if (!grs) return;

            let rectP = grs.getBoundingClientRect();
            let rectZ = zombie.getBoundingClientRect();

            if (
                rectP.right - 30 > rectZ.left &&
                rectP.left < rectZ.right &&
                rectP.bottom > rectZ.top + 100 &&
                rectP.top < rectZ.bottom
            ) {
                console.log("ini kena");

                clearInterval(checkCollision);
                clearInterval(zombie.zombieInterval);

                zombie.zombieInterval = setInterval(
                    () => {
                        zombie.src = `./Sprites/Zombie/frame_${String(
                            zombie.frameZombie
                        ).padStart(2, "0")}_delay-0.05s.gif`;
                        zombie.style.left = x - zombie.xZombie + "px";

                        zombie.frameZombie = (zombie.frameZombie + 1) % 33;
                    },
                    zombie.status == "none" ? 50 : 200
                );

                zombie.eatInterval = setInterval(() => {
                    console.log("dimakan");
                    grs.health -= 20;
                    if (grs.health <= 0) {
                        clearInterval(gr.plantInterval);
                        clearInterval(gr.delayInterval);
                        clearInterval(zombie.eatInterval);
                        grs.dataset.hasPlant = "false";
                        grs.src = `./Sprites/General/Grass.bmp`;
                        clearInterval(zombie.zombieInterval);
                        zombie.zombieInterval = setInterval(
                            () => {
                                zombie.src = `./Sprites/Zombie/frame_${String(
                                    zombie.frameZombie
                                ).padStart(2, "0")}_delay-0.05s.gif`;

                                zombie.xZombie += 1;
                                zombie.style.left = x - zombie.xZombie + "px";

                                zombie.frameZombie =
                                    (zombie.frameZombie + 1) % 33;
                            },
                            zombie.status == "none" ? 50 : 200
                        );
                    }
                }, 1000);
            }
        }, 16);
    });
}

peashooter.addEventListener("click", (e) => {
    if (over) return;
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
        if (over) return;

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
        if (over) return;

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
                    img.shootInterval;
                    img.src =
                        plant == "PeaShooter"
                            ? "./Sprites/General/Pea.png"
                            : "./Sprites/General/IcePea.png";
                    img.classList.add(plant == "PeaShooter" ? "pea" : "icepea");

                    let x = 90;

                    gr.appendChild(img);
                    img.shootInterval = setInterval(() => {
                        img.style.left = `${x}px`;
                        x += 5;
                        if (x >= 1000) {
                            clearInterval(img.shootInterval);
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
                img.shootInterval;
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
                img.shootInterval = setInterval(() => {
                    img.style.top = `${y}px`;
                    y += 1;
                    if (y == 50) {
                        clearInterval(img.shootInterval);
                    }
                }, 16);
                setTimeout(() => {
                    gr.removeChild(img);
                }, 12000);
            }, 10000);
        }
    });

    gr.addEventListener("mouseleave", () => {
        if (over) return;

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

sortSelect.addEventListener("change", ()=> {
    showLb(sortSelect.value);
})