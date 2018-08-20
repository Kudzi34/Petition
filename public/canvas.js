const canvas = document.getElementById("canvas");
if (canvas) {
    const context = canvas.getContext("2d");
    // const dataURL = canvas.toDataURL();

    let inCanvas = false;

    // mousedown

    canvas.addEventListener("mousedown", e => {
        context.beginPath();
        inCanvas = true;
        console.log(e.target);
        console.log("Working");

        // mousemove

        canvas.addEventListener("mousemove", e => {
            if (inCanvas) {
                context.lineTo(e.offsetX, e.offsetY);
                context.stroke();
                console.log("Moving");
            }
        });
    });

    // mouseup

    canvas.addEventListener("mouseup", e => {
        if (!inCanvas) {
            return;
        }
        const dataURL = canvas.toDataURL();
        $('input[name="signature"]').val(dataURL);
        console.log(dataURL);
        inCanvas = false;
    });
}
