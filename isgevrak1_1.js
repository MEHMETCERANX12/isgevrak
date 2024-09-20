function menublok(showId, hideIds)
{
	var $showElement = $('#' + showId);
        hideIds.forEach(function(id)
        {
            $('#' + id).slideUp();
        });
        if ($showElement.is(':visible'))
        {
            $showElement.slideUp();
        } else {
            $showElement.slideDown();
        }
    }
    $(document).ready(function()
    {
        $('#blok1').hide();
        $('#blok2').hide();
        $('#blok3').hide();
        $('#blok4').hide();
    });
    function toggleBlock(showId, hideId)
    {
        var $showElement = $('#' + showId);
        var $hideElement = $('#' + hideId);
        // Gösterilecek bloğu aç
        if ($showElement.is(':hidden'))
        {
            $showElement.slideDown();
        }
        // Gizlenecek bloğu kapat
        if ($hideElement.is(':visible')) {
            $hideElement.slideUp();
        }
        var element = document.getElementById('aspicerik');
        // Eğer blok 'blok1' ise genişliği değiştir
        if (showId === 'menuacma')    
        {
            element.style.left = "3%";
            element.style.margin = "auto";
            element.style.width = "96%";
        } 
        else if (showId === 'mastermenuackapa')
        {
            element.style.left = "11%";
            element.style.margin = "auto";
            element.style.width = "88%";
        }

    }
$(function() {
    if (typeof tarih1ID !== 'undefined' && $("#" + tarih1ID).length) {
        $("#" + tarih1ID).datepicker({
            firstDay: 1,
            dateFormat: "dd.mm.yy",
            autoSize: false,
            changeMonth: true,
            changeYear: true,
            dayNames: ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"],
            dayNamesMin: ["paz", "pzt", "sal", "çar", "per", "cum", "cmt"],
            defaultDate: 0,
            maxDate: "+1y+0m+0w",
            minDate: "-6y-0m-0w",
            monthNamesShort: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            nextText: "ileri",
            prevText: "geri",
            showAnim: "slideDown"
        });
    }
});
$(function() {
    if (typeof tarih2ID !== 'undefined' && $("#" + tarih2ID).length) {
        $("#" + tarih2ID).datepicker({
            firstDay: 1,
            dateFormat: "dd.mm.yy",
            autoSize: false,
            changeMonth: true,
            changeYear: true,
            dayNames: ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"],
            dayNamesMin: ["paz", "pzt", "sal", "çar", "per", "cum", "cmt"],
            defaultDate: 0,
            maxDate: "+1y+0m+0w",
            minDate: "-6y-0m-0w",
            monthNamesShort: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            nextText: "ileri",
            prevText: "geri",
            showAnim: "slideDown"
        });
    }
});
$(function() {
    if (typeof tarih3ID !== 'undefined' && $("#" + tarih3ID).length) {
        $("#" + tarih3ID).datepicker({
            firstDay: 1,
            dateFormat: "dd.mm.yy",
            autoSize: false,
            changeMonth: true,
            changeYear: true,
            dayNames: ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"],
            dayNamesMin: ["paz", "pzt", "sal", "çar", "per", "cum", "cmt"],
            defaultDate: 0,
            maxDate: "+1y+0m+0w",
            minDate: "-6y-0m-0w",
            monthNamesShort: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            nextText: "ileri",
            prevText: "geri",
            showAnim: "slideDown"
        });
    }
});

$(function() {
    if (typeof tarih4ID !== 'undefined' && $("#" + tarih4ID).length) {
        $("#" + tarih4ID).datepicker({
            firstDay: 1,
            dateFormat: "dd.mm.yy",
            autoSize: false,
            changeMonth: true,
            changeYear: true,
            dayNames: ["pazar", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi"],
            dayNamesMin: ["paz", "pzt", "sal", "çar", "per", "cum", "cmt"],
            defaultDate: 0,
            maxDate: "+1y+0m+0w",
            minDate: "-6y-0m-0w",
            monthNamesShort: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            nextText: "ileri",
            prevText: "geri",
            showAnim: "slideDown"
        });
    }
});
    $(document).ready(function () {
        // Tüm input alanlarında Enter tuşunu devre dışı bırak
        $("input").keypress(function (event) {
            if (event.which === 13) { // 13: Enter tuşu
                event.preventDefault(); // Enter tuşunun varsayılan işlevini iptal et
            }
        });
    });


function kopyala() {
    var copyText = $('#' + textBoxClientID);
    copyText.select(); // TextBox'taki metni seç
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText.val()).then(function() {
            alertify.success('Metin başarıyla kopyalandı');
        }).catch(function(err) {
            alertify.error('Kopyalama işlemi başarısız oldu');
        });
    } else {
        document.execCommand("copy");
        alertify.success('Metin başarıyla kopyalandı');
    }
}



$(document).ready(function () {
    if (localStorage.getItem("diyalog1_hidden") === "true") {
        $('#diyalog1').hide();
    }

    if (localStorage.getItem("diyalog2_hidden") === "true") {
        $('#diyalog2').hide();
    }

    if (localStorage.getItem("scrollPosition") !== null) {
        $(window).scrollTop(localStorage.getItem("scrollPosition"));
    }

    $("form").on("submit", function () {
        localStorage.setItem("scrollPosition", $(window).scrollTop());
    });

    $('#hideDiyalog1').on("click", function () {
        $('#diyalog1').hide();
        localStorage.setItem("diyalog1_hidden", "true");
    });

    $('#hideDiyalog2').on("click", function () {
        $('#diyalog2').hide();
        localStorage.setItem("diyalog2_hidden", "true");
    });
    $('#showDiyalog1').on("click", function () {
        $('#diyalog1').show();
        localStorage.removeItem("diyalog1_hidden");
    });

    $('#showDiyalog2').on("click", function () {
        $('#diyalog2').show();
        localStorage.removeItem("diyalog2_hidden");
    });
});



