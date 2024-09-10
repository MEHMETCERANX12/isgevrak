$(document).ready(function() {
    // Menü öğesine tıklanınca diğer menüleri kapat ve sadece tıklanan menüyü aç
    $(".menudokuman > li > a").click(function(e) {
        e.preventDefault();  // Varsayılan davranışı önle
        var $submenudokuman = $(this).next(".submenudokuman");  // Tıklanan menünün alt menüsü

        // Eğer tıklanan menü zaten aktifse
        if ($(this).hasClass("active")) {
            // Aktif menü öğesini deaktif hale getir ve alt menüyü gizle
            $(this).removeClass("active");
            $submenudokuman.slideUp();
        } else {
            // Diğer tüm menü öğelerinden active sınıfını kaldır
            $(".menudokuman > li > a").removeClass("active");

            // Diğer tüm menülerin alt menülerini kapat
            $(".menudokuman .submenudokuman").slideUp();

            // Tıklanan menünün alt menüsünü aç
            $submenudokuman.slideDown();

            // Tıklanan menü öğesine active sınıfını ekle
            $(this).addClass("active");
        }
    });

    // Menüdeki öğe sayısını göstermek için sayıyı hesapla
    $(".menudokuman > li").each(function() {
        var itemCount = $(this).find(".submenudokuman li").length;
        $(this).find(".item-count").text("(" + itemCount + ")");
    });
});
