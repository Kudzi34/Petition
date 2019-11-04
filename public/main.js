$(document).ready(() => {
  $(".description").on("mouseover", event => {
    $(event.currentTarget).addClass("hovered-discrip ");
  });

  $(".description").on("mouseleave", event => {
    $(event.currentTarget).removeClass("hovered-discrip ");
  });
});
