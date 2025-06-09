function dokumansecimsayfamenu(btn)
{
    var $btn = $(btn);
    var $submenu = $btn.next('.menuicerik');
    $('.menuicerik').not($submenu).slideUp();
    $submenu.slideToggle();
}

function menublok(showId, hideIds) {
    var $showElement = $('#' + showId);

    // Gizlenecek ID'leri kapat
    hideIds.forEach(function (id) {
        $('#' + id).slideUp();
    });

    // Gösterilecek ID açık ise kapat, kapalı ise aç
    if ($showElement.is(':visible')) {
        $showElement.slideUp();
    } else {
        $showElement.slideDown();
    }
}

function toggleBlock(showId, hideId) {
    var $showElement = $('#' + showId);
    var $hideElement = $('#' + hideId);

    // Gösterilecek bloğu aç
    if ($showElement.is(':hidden')) {
        $showElement.slideDown();
    }

    // Gizlenecek bloğu kapat
    if ($hideElement.is(':visible')) {
        $hideElement.slideUp();
    }

    // Ana içerik genişliğini ayarla
    var element = document.getElementById('aspicerik');
    if (showId === 'menuacma') {
        element.style.left = "3%";
        element.style.margin = "auto";
        element.style.width = "96%";
    } else if (showId === 'mastermenuackapa') {
        element.style.left = "11%";
        element.style.margin = "auto";
        element.style.width = "88%";
    }
}

// Sayfa yüklenince çalıştırılacak işlemler
$(document).ready(function () {
    // Blokları başlangıçta gizle
    ['#blok1', '#blok2', '#blok3', '#blok4'].forEach(function (id) {
        $(id).hide();
    });

    // Enter tuşunun varsayılan davranışını engelle
    $("input").keypress(function (event) {
        if (event.which === 13) { // 13: Enter tuşu
            event.preventDefault();
        }
    });
});

// Sayfa yeniden yüklendiğinde alertify mesajlarını temizle
window.onload = function () {
    if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
        alertify.dismissAll();
    }
};

// Tarih formatlama ve datepicker ayarları
$(document).ready(function () {
    // Eğer tarih kutusu yoksa işlemi durdur
    if ($(".csstextboxtarih").length === 0) {
        return;
    }

    $(".csstextboxtarih").datepicker({
        firstDay: 1,
        dateFormat: "dd.mm.yy",
        autoSize: false,
        changeMonth: true,
        changeYear: true,
        dayNames: ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"],
        dayNamesMin: ["paz", "pzt", "sal", "çar", "per", "cum", "cmt"],
        defaultDate: 0,
        monthNamesShort: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        nextText: "ileri",
        prevText: "geri",
        showAnim: "slideDown"
    });
});
