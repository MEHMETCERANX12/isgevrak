function loginhata()
{
    var e = document.getElementById("mesaj");
    e.style.display = "flex";
    setTimeout(() => e.style.display = "none", 7000);
}
function sifreoku()
{
    document.getElementById('HiddenField1').value = document.getElementById('tckimlik').value;
    document.getElementById('HiddenField2').value = document.getElementById('sifre').value;
}
