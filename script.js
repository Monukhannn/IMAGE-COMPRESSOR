// Show image size immediately after selecting image

document.getElementById("imageInput")
.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const originalKB = file.size / 1024;
    const originalMB = originalKB / 1024;

    const targetKB =
        parseFloat(
            document.getElementById("targetSize").value
        ) || 100;

    document.getElementById("selectedImageSize").innerHTML =
        `Selected Image Size: ${originalKB.toFixed(2)} KB (${originalMB.toFixed(2)} MB)`;

    document.getElementById("targetSizeInfo").innerHTML =
        `Target Size: ${targetKB} KB`;

    document.getElementById("reductionInfo").innerHTML =
        `Need to Reduce: ${(originalKB - targetKB).toFixed(2)} KB`;
});


// Update target size instantly

document.getElementById("targetSize")
.addEventListener("input", function(){

    const file =
        document.getElementById("imageInput").files[0];

    if(!file) return;

    const originalKB = file.size / 1024;
    const targetKB = parseFloat(this.value) || 0;

    document.getElementById("targetSizeInfo").innerHTML =
        `Target Size: ${targetKB} KB`;

    document.getElementById("reductionInfo").innerHTML =
        `Need to Reduce: ${(originalKB - targetKB).toFixed(2)} KB`;
});


// Compress image

function compressImage(){

    const file =
        document.getElementById("imageInput").files[0];

    if(!file){
        alert("Please select an image.");
        return;
    }

    const targetKB =
        parseFloat(document.getElementById("targetSize").value);

    if(!targetKB || targetKB <= 0){
        alert("Enter a valid target size.");
        return;
    }

    const originalKB = file.size / 1024;

    const reader = new FileReader();

    reader.onload = function(event){

        const img = new Image();

        img.onload = function(){

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            let quality = 1.0;
            let compressedData;
            let compressedKB;

            while(quality > 0.05){

                compressedData =
                    canvas.toDataURL("image/jpeg", quality);

                compressedKB =
                    (compressedData.length * 3 / 4) / 1024;

                if(compressedKB <= targetKB){
                    break;
                }

                quality -= 0.05;
            }

            const compressionPercentage =
                ((originalKB - compressedKB) / originalKB) * 100;

            document.getElementById("compressedSize").innerHTML =
                `Compressed Size: ${compressedKB.toFixed(2)} KB`;

            document.getElementById("compressionPercent").innerHTML =
                `Compression: ${compressionPercentage.toFixed(2)}%`;

            document.getElementById("preview").innerHTML =
                `<img src="${compressedData}" alt="Compressed Image">`;

            const downloadBtn =
                document.getElementById("downloadBtn");

            downloadBtn.href = compressedData;
            downloadBtn.download = "compressed-image.jpg";
            downloadBtn.style.display = "inline-block";
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}