const imageUpload = document.getElementById("image-upload");
const extractButton = document.getElementById("extract-button");
const resultDiv = document.getElementById("result");

// Define a regular expression to match Ethereum addresses
const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;

// Listen for when the user selects an image
imageUpload.addEventListener("change", () => {
  const image = new Image();
  image.src = URL.createObjectURL(imageUpload.files[0]);

  // Draw the image onto a canvas element
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    // Loop through each pixel and check for potential Ethereum addresses
    let addresses = [];
    for (let i = 0; i < imageData.length; i += 4) {
      const red = imageData[i];
      const green = imageData[i + 1];
      const blue = imageData[i + 2];

      // Check if the pixel color is within a certain range
      if (red > 200 && green < 50 && blue < 50) {
        // Extract the potential address from the surrounding pixels
        const surroundingPixels = imageData.slice(i - 10, i + 100);
        const potentialAddress = String.fromCharCode(...surroundingPixels)
          .trim()
          .match(ethereumAddressRegex);

        if (potentialAddress !== null) {
          addresses.push(potentialAddress[0]);
        }
      }
    }

    // Display the addresses on the page
    if (addresses.length > 0) {
      resultDiv.innerHTML = "<h2>Potential Ethereum Addresses:</h2><ul>";
      addresses.forEach((address) => {
        resultDiv.innerHTML += "<li>" + address + "</li>";
    });
    resultDiv.innerHTML += "</ul>";
    resultDiv.style.display = "block";
  } else {
    resultDiv.innerHTML = "No potential Ethereum addresses found.";
    resultDiv.style.display = "block";
  }
  };
  });
  
  // Listen for when the user clicks the "Extract Addresses" button
  extractButton.addEventListener("click", () => {
  resultDiv.innerHTML = "";
  resultDiv.style.display = "none";
  imageUpload.click();
  });