// menublok fonksiyonu: Belirli blokları gösterip gizler
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

// toggleBlock fonksiyonu: Belirli bir blok açılırken, diğerini kapatır
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

    // SQL tarih formatını datepicker için dönüştür
    function formatSqlDateForDatepicker(sqlDate) {
        if (!sqlDate || !/\d{1,2}\.\d{1,2}\.\d{4}/.test(sqlDate)) {
            return null;
        }

        var datePart = sqlDate.split(' ')[0]; // Sadece tarihi al (ör. '1.10.2024')
        var parts = datePart.split('.');
        if (parts.length === 3) {
            var day = parts[0].padStart(2, '0');
            var month = parts[1].padStart(2, '0');
            var year = parts[2];
            return day + '.' + month + '.' + year; // '01.10.2024' formatına çevir
        }
        return null;
    }

    // Datepicker ayarları
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

    // Tarih kutularının değerini SQL formatından dönüştür ve uygula
    $(".csstextboxtarih").each(function () {
        var currentVal = $(this).val();
        var formattedDate = formatSqlDateForDatepicker(currentVal);
        if (formattedDate) {
            $(this).val(formattedDate);
            $(this).datepicker("setDate", formattedDate);
        }
    });
});
