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
$(function ()
  {
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
});

$(function ()
  {
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
});

$(function ()
  {
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
});

$(function ()
  {
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
});
