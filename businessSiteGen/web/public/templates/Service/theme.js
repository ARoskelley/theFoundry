(() => {
  const items = document.querySelectorAll(".faqs details");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.removeAttribute("open");
        });
      }
    });
  });
})();
