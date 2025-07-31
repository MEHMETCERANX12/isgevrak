function mastermenugizle()//2025
{
    $('#mastermenuackapa').fadeOut();
    $('#menuacma').fadeIn();
    var $element = $('#aspicerik');
    $element.css({ left: "3%", margin: "auto", width: "96%"});
}
function mastermenugoster()
{
    $('#mastermenuackapa').fadeIn();
    $('#menuacma').fadeOut();
    var $element = $('#aspicerik');
    $element.css({ left: "11%", margin: "auto", width: "88%"});
}

function mastermenublok(button)//2025
{
    var $clickedButton = $(button);
    var $clickedMenuDiv = $clickedButton.closest('.mastermenunesne');
    var $targetBlock = $clickedMenuDiv.next('[id^="blok"]');
    $('[id^="blok"]').not($targetBlock).slideUp();
    if ($targetBlock.is(':visible'))
    {
        $targetBlock.slideUp();
    }
    else
    {
        $targetBlock.slideDown();
    }
}



function dokumansecimsayfamenu(btn)
{
    var $btn = $(btn);
    var $submenu = $btn.next('.menuicerik');
    $('.menuicerik').not($submenu).slideUp();
    $submenu.slideToggle();
}





$(document).ready(function () {
    // Blokları başlangıçta gizle
    ['#blok1', '#blok2', '#blok3', '#blok4'].forEach(function (id) {
        $(id).hide();
    });

    $("input").keypress(function (event) {
        if (event.which === 13) { // 13: Enter tuşu
            event.preventDefault();
        }
    });
});

window.onload = function () {
    if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
        alertify.dismissAll();
    }
};

function acilisverisianasayfa()
{
    let deger = $("#HiddenField4").val();
    if (deger === "1") {
        let data = $("#HiddenField1").val();
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error("JSON parse hatası:", e);
                data = [];
            }
        }
        store.set('firmajson', data);
        let uzman = JSON.parse($("#HiddenField2").val());
        let uzmanlist = uzman.map(item => ({ uz: item.uz, un: item.un, kr: item.kr }));
        store.set("uzman", JSON.stringify({ uzmanlist }));
        store.set("uzmanad", uzman[0].uz);
        store.set("uzmanno", uzman[0].un);
        store.set("uzmankurum", uzman[0].kr);
        let ayar = JSON.parse($("#HiddenField3").val());
        store.set("ayar", ayar);
    }
}

function duyuruicerikanasayfa()
{
    const duyurular =
    {
        "1":
        {
            "baslik": "Mesleki Eğitim Belgesi Zorunluluğu ve Geçerli Belgeler",
            "metin": "6331 sayılı İş Sağlığı ve Güvenliği Kanununa göre belirlenen tehlikeli ve çok tehlikeli sınıfta yer alan işlerde çalışanların mesleki eğitimlerinin usul ve esaslarını düzenleyen Tehlikeli ve Çok Tehlikeli İşlerde Çalışanların Mesleki Eğitimlerine Dair Yönetmeliğin Ek-1 çizelgesinde yer alan işlerde fiilen çalıştırılacakların, yaptığı işe uygun ve Yönetmeliğin 6. maddesinde tanımlanan belgelerden birisine sahip olmaları zorunludur. Söz konusu 6. maddede bu eğitimi hangi kurum / kuruluşların ne şartlarda verebileceği belirtilmiştir.<br/><br/>Ancak 6645 sayılı İş Sağlığı ve Güvenliği Kanunu ile Bazı Kanun ve Kanun Hükmünde Kararnamelerde Değişiklik Yapılmasına Dair Kanunun 74. maddesi ile 5544 sayılı Mesleki Yeterlilik Kurumu Kanununda değişiklik yapılarak 5544 sayılı Kanuna göre belirlenmiş işlerde de mesleki eğitim belgesi zorunluluğu getirilmiştir.<br/><br/>Söz konusu değişiklik ile Meslekî Yeterlilik Belgesi zorunluluğu getirilen meslekleri belirlemek amacıyla Meslekî Yeterlilik Belgesi Zorunluluğu Getirilen Mesleklere İlişkin Tebliğler yayımlanmıştır. Anılan Tebliğlerde yayımlanan meslekler için geçerli olan mesleki eğitim belgeleri;<br/><br/><strong>-3308 sayılı Mesleki Eğitim Kanununa göre alınmış ustalık belgesi,</strong><br/><br/><strong>-Millî Eğitim Bakanlığına bağlı meslekî ve teknik eğitim okullarından ve üniversitelerin meslekî ve teknik eğitim veren okul ve bölümlerin ilgili alanından alınmış diploma,</strong><br/><br/><strong>- İlgili alanda alınmış MYK Belgesi’dir.</strong><br/><br/> Adı geçen Yönetmeliğin Ek-1 listesinde yer alan bir işin MYK belge zorunluluğu getirilen meslekler arasına alınması durumunda, MYK mevzuatı kapsamında belirtilen geçerli mesleki eğitim belgesine sahip olunması zorunludur. MYK tarafından zorunluluk getirilmeyen ancak anılan Yönetmeliğin Ek-1 listesinde yer alan faaliyetler için ise 6331 sayılı Kanun kapsamında mesleki eğitim zorunluluğu olacağından söz konusu Yönetmeliğin 6. maddesinde belirtilen geçerli mesleki eğitim belgesine sahip olunmalıdır.<br/><br/>Bilgilerinize sunulur."
        },
        "2":
        {
            "baslik": "İşyerlerinde İşveren veya İşveren Vekili Tarafından Yürütülecek İş Sağlığı ve Güvenliği Hizmetlerine Yönelik Sıkça Sorulan Sorular",
            "metin": "<strong>1- Eğitim sonunda aldığımız belgenin geçerlilik süresi ne kadardır?</strong><br/><br/>“İşyerlerinde İşveren veya İşveren Vekili Tarafından Yürütülecek İş Sağlığı ve Güvenliği Hizmetlerine İlişkin Yönetmelik” kapsamında eğitim alan kişilere Yönetmeliğin Ek-3’ündeki örneğine uygun “İş Sağlığı ve Güvenliği Hizmetlerinin Yürütümüne İlişkin İşveren veya İşveren Vekili Eğitimi Tamamlama Belgesi” düzenlenir. Düzenlenen bu belge ve alınan eğitim süresiz şekilde geçerlidir. <br/><br/><strong>2- İşveren Vekili ile kastınız nedir? Noterden vekâlet mi almamız gerekiyor? Herkes vekil olabiliyor mu? Ben burada çalışan biri olarak eğitime katılabilir miyim? </strong><br/><br/>“İşyerlerinde İşveren veya İşveren Vekili Tarafından Yürütülecek İş Sağlığı ve Güvenliği Hizmetlerine İlişkin Yönetmelik” in 4 üncü maddesinin birinci fıkrasının (f) bendinde işveren vekili şu şekilde tanımlanmıştır: <br/><br/> “f) İşveren vekili: Bu Yönetmelik kapsamındaki işyerlerinde, işveren adına hareket eden, işin ve işyerinin bütününün yönetiminde görev alan kişiyi,” <br/><br/>Bu tanım kapsamında, kişilerin işveren vekili olup olmadığına ilişkin tespitler, Sosyal Güvenlik Kurumu (SGK) işyeri tescil kayıtları esas alınarak yapılmaktadır. <br/><br/>Bununla birlikte aynı Yönetmeliğin 5 inci maddesinin altıncı fıkrasında yer alan aşağıdaki hükümde işveren vekili tanımı detaylandırılmıştır: <br/><br/>“İşveren vekili; 4 üncü maddede yer alan işveren vekili tanımına uygun ve işyerinde tam süreli hizmet akdi ile çalışanlar arasından görevlendirilir. Kamu kurum ve kuruluşlarında iş sağlığı ve güvenliği hizmetlerini en üst amir, yardımcıları veya bu görevi yürütenler üstlenebilir.” <br/><br/>Bu itibarla, “İş Sağlığı ve Güvenliği Hizmetlerinin Yürütümüne İlişkin İşveren veya İşveren Vekili Eğitimi” herhangi bir şart olmaksızın herkes tarafından katılım sağlanabilecek bir eğitim olup eğitimi alan kişiler, SGK işyeri tescil kayıtlarında herhangi bir işyerinde İşveren – Ortak – İşveren Vekili – Yönetici koduyla kayıtlı olması halinde, İSG-KATİP üzerinden yetkilisi oldukları işyeri için taahhüt işlemi yapabilecektir. <br/><br/><strong>3- Eğitime katılmak için üniversite mezunu olmam gerekiyor mu? </strong><br/><br/>“İş Sağlığı ve Güvenliği Hizmetlerinin Yürütümüne İlişkin İşveren veya İşveren Vekili Eğitimi” herhangi bir şart olmaksızın herkes tarafından katılım sağlanabilecek bir eğitimdir. <br/><br/><strong>4- Aldığım belge ile 1’den fazla iş yerine bakabilir miyim? </strong><br/><br/> “İş Sağlığı ve Güvenliği Hizmetlerinin Yürütümüne İlişkin İşveren veya İşveren Vekili Eğitimi Tamamlama Belgesi” bulunan işverenler, toplam çalışan sayısının 50’den az olması şartıyla kendilerine ait az tehlikeli sınıfta yer alan aynı il sınırları içerisindeki birden fazla işyerinin iş sağlığı ve güvenliği hizmetlerini üstlenebilir. <br/><br/>Anılan belgeye sahip işveren vekilleri ise tam süreli hizmet akdi ile çalıştıkları yalnızca tek bir işyerinin iş sağlığı ve güvenliği hizmetlerini üstlenebilir. <br/><br/><strong>5- Denetleme olursa ceza alır mıyım? </strong><br/><br/>6331 sayılı İş Sağlığı ve Güvenliği Kanununun 26 ncı maddesi gereğince Kanun hükümlerinin yerine getirilmemesi durumunda idari para cezaları uygulanmaktadır. İdari para cezaları, gerekçesi belirtilmek suretiyle Çalışma ve İş Kurumu il müdürlüklerince verilmektedir. <br/><br/><strong>6- İş sağlığı ve güvenliği lisans veya ön lisans programı mezunuyum. Çalıştığım yerde görev yapabilmek için ben de eğitimi almak zorunda mıyım? </strong><br/><br/>İş Güvenliği Uzmanlarının Görev, Yetki, Sorumluluk Ve Eğitimleri Hakkında Yönetmeliğin 4 üncü maddesinde bahse konu mezunlar teknik eleman olarak tanımlanmış olup aynı Yönetmeliğin 8 inci maddesinde de teknik elemanların nasıl iş güvenliği uzmanı belgesi alabileceği açıklanmaktadır. <br/><br/>Bu doğrultuda iş güvenliği uzmanlığı belgesine sahip olan bahse konu olan mezunların İşyerlerinde İşveren veya İşveren Vekili Tarafından Yürütülecek İş Sağlığı ve Güvenliği Hizmetlerine İlişkin Yönetmeliğin 18 inci maddesinde “(1) Bu Yönetmelik kapsamındaki işyerlerinde iş güvenliği uzmanlığı belgesi bulunan işveren veya işveren vekilleri, 7 nci ve 8 inci maddelerde belirtilen hizmetler hariç iş sağlığı ve güvenliği hizmetlerini üstlenebilir.” hükmü kapsamında ilgili hizmetleri iş güvenliği uzmanı olarak yürütebilir. <br/><br/><strong>7- Daha önceden aldığım sertifikamı kullanabilir miyim? İSG-KATİP’e kaydımı nasıl oluştururum? </strong><br/><br/>İş Sağlığı ve Güvenliği Hizmetlerinin Yürütümüne İlişkin İşveren veya İşveren Vekili Eğitimi Tamamlama Belgesi’ne dair geçerlilik süresi tanımlanmadığından belgeye sahip işveren veya işveren vekillerinin İSG-KATİP üzerinden ilgili işyeri için taahhüt işlemi yapması gerekmektedir. İSG-KATİP’e tanımlama işleminin yapılması ile ilgili bilgi için; https://isgkatip.csgb.gov.tr/ adresi Duyurular kısmından “İŞVEREN VE İŞVEREN VEKİLİ TAAHHÜTNAMESİ SİSTEM KILAVUZU” incelenmelidir. <br/><br/><strong>8- Eğitimi tamamladım, şimdi ne yapmam gerekiyor? </strong><br/><br/>İş Sağlığı ve Güvenliği Hizmetlerinin Yürütümüne İlişkin İşveren veya İşveren Vekili Eğitimi Tamamlama Belgesi’ne sahip işveren veya işveren vekillerinin İSG-KATİP üzerinden ilgili işyeri için taahhüt işlemi yapması gerekmektedir."
        },
        "3":
        {
            "baslik": "Eğitim ve Sınav Şartı Olmaksızın Üst Belgeye Geçiş Hakkında",
            "metin": "<strong>(B) sınıfı iş güvenliği uzmanlığı belgesiyle, çok tehlikeli sınıftaki işyerlerinde 31/12/2024 tarihi itibarıyla en az üç yıl fiilen görev yaptığını iş güvenliği uzmanlığı sözleşmesi ile belgeleyenlerden son vize döneminde ihtar puanı veya askıya alma işlemi uygulanmamış olanlara, 31/3/2025 tarihine kadar başvurmaları halinde (A) sınıfı iş güvenliği uzmanlığı belgesi EK-1’deki örneğine uygun olarak Genel Müdürlükçe verilir.<br/><br/>(2) (C) sınıfı iş güvenliği uzmanlığı belgesiyle, tehlikeli ve/veya çok tehlikeli sınıftaki işyerlerinde 31/12/2024 tarihi itibarıyla en az üç yıl fiilen görev yaptığını iş güvenliği uzmanlığı sözleşmesi ile belgeleyenlerden son vize döneminde ihtar puanı veya askıya alma işlemi uygulanmamış olanlara, 31/3/2025 tarihine kadar başvurmaları halinde (B) sınıfı iş güvenliği uzmanlığı belgesi EK-1’deki örneğine uygun olarak Genel Müdürlükçe verilir. <br/><br/>(3) Birinci ve ikinci fıkrada belirtilen fiili çalışma süresinin hesabında sadece İSG-KATİP’te kayıtlı iş güvenliği uzmanlığı sözleşmeleri esas alınır.”şeklindedir. <br/><br/>İlgili maddenin yürürlüğe girmesi ile birlikte Genel Müdürlüğümüzce iki husus hakkında açıklama gereği duyulmuştur. <br/><br/>1. Eğitim ve Sınav Şartı Olmaksızın Üst Belge Verilmesi Hususu:</strong><br/><br/>20/6/2012 tarihli ve 6331 sayılı İş Sağlığı ve Güvenliği Kanununda işyerleri yapılan işin özelliği, işin her safhasında kullanılan veya ortaya çıkan maddeler, iş ekipmanı, üretim yöntem ve şekilleri, çalışma ortam ve şartları vb. diğer hususlar dikkate alınarak tehlike sınıflarına göre gruplandırılmıştır. Bu sınıflama kapsamında işyerleri, az tehlikeli, tehlikeli ve çok tehlikeli olmak üzere 3 gruba ayrılmıştır. Kanun çerçevesinde yürütülen işlemlerin genelinde bu tehlike sınıfları esastır.<br/><br/>Bununla birlikte; mezkûr Kanunda işverene iş sağlığı ve güvenliği ile ilgili konularda rehberlik ve danışmanlık yapmak üzere iş güvenliği uzmanı ve işyeri hekimi görevlendirme yükümlülüğü getirilmiştir. İş güvenliği uzmanı görevlendirme yükümlülüğünün yerine getirilmesinde işyeri tehlike sınıfları esas alınmıştır. Bu kapsamda; iş güvenliği uzmanlarının görev alabilmeleri için; çok tehlikeli sınıfta yer alan işyerlerinde (A) sınıfı, tehlikeli sınıfta yer alan işyerlerinde en az (B) sınıfı, az tehlikeli sınıfta yer alan işyerlerinde ise en az (C) sınıfı iş güvenliği uzmanlığı belgesine sahip olmaları şartı aranmaktadır. <br/><br/>6331 sayılı Kanunda yer verilen (A), (B) ve (C) sınıfı iş güvenliği uzmanlarının,  nitelikleri ve görevlendirilmeleri ile iş güvenliği uzmanlığı belgesi alınmasına ilişkin şartlar ise 29/12/2012 tarihli ve 28512 sayılı Resmî Gazete’de yayımlanan İş Güvenliği Uzmanlarının Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik ile düzenlenmiştir. Yönetmeliğin dayanak maddesinde yer alan 6331 sayılı Kanunun 30 uncu maddesinin birinci fıkrasında “Aşağıdaki konular ile bunlara ilişkin usul ve esaslar Bakanlıkça çıkarılacak yönetmeliklerle düzenlenir” hükmü yer almaktadır. Anılan fıkranın (b) bendinin (5) numaralı alt bendinde yer alan “İşyeri hekimi, iş güvenliği uzmanı ve diğer sağlık personelinin eğitimleri ve belgelendirilmeleri, unvanlarına göre kimlerin hangi sınıf belge alabilecekleri, işyeri hekimi, iş güvenliği uzmanı ve diğer sağlık personeli eğitimi verecek kurumların belgelendirilmeleri, yetkilendirilmeleri ile eğitim programlarının ve bu programlarda görev alacak eğiticilerin niteliklerinin belirlenmesi ve belgelendirilmeleri, eğitimlerin sonunda yapılacak sınavlar ve düzenlenecek belgeler.” hükmü uyarınca ilgili Yönetmeliğin “İş güvenliği uzmanlığı belgesi” başlıklı 8 inci maddesinde bu hususlar düzenlenmiştir. <br/><br/>İlgili maddeye bakıldığında ise; (A) sınıfı iş güvenliği uzmanlığı belgesinin verilme şartlarının kategorik olarak iki gruba ayrıldığı görülmektedir. <br/><br/>Birinci grup belirli şartları sağlaması halinde iş güvenliği uzmanlığı eğitimine katılma ve sınavında başarılı olma halidir. İlgili maddenin birinci fıkrasının (a) bendinin (1) numaralı alt bendinde bu husus “(B) sınıfı iş güvenliği uzmanlığı belgesiyle en az dört yıl fiilen görev yaptığını iş güvenliği uzmanlığı sözleşmesi ile belgeleyen ve (A) sınıfı iş güvenliği uzmanlığı eğitimine katılarak yapılacak (A) sınıfı iş güvenliği uzmanlığı sınavında başarılı olanlara” şeklinde tanımlanmıştır. <br/><br/>İkinci grup ise mühendislik veya mimarlık eğitimi veren fakülte mezunları ile teknik elemanlardan, mezuniyet ve/veya unvan gibi belirli şartları sağlayanlara iş güvenliği uzmanlığı eğitimine ve ilgili sınava katılma şartı olmaksızın doğrudan belgenin verilmesi halidir. İlgili maddenin birinci fıkrasının (a) bendinin (2) numaralı alt bendinde iş sağlığı ve güvenliği veya iş güvenliği doktora mezunlarına, (3) numaralı alt bendinde Genel Müdürlük veya bağlı birimlerinde en az on yıl görev yapmış olanlara, (4) numaralı alt bendinde iş sağlığı ve güvenliği alanında müfettiş yardımcılığı süresi dâhil en az on yıl görev yapmış iş müfettişlerine ve (5) numaralı alt bendinde Genel Müdürlük ve bağlı birimlerinde uzman yardımcılığı süresi dâhil en az on yıl fiilen görev yapmış iş sağlığı ve güvenliği uzmanlarına (A) sınıfı iş güvenliği uzmanlığı belgesinin doğrudan verileceği düzenlenmiştir. <br/><br/> (B) ve (C) sınıfı iş güvenliği uzmanlığı belgeleri için de benzer ve farklı düzenlemeler yine ilgili maddede belirlenmiştir. <br/><br/> (A) sınıfı belgeye sahip bir iş güvenliği uzmanı, çok tehlikeli, tehlikeli ve az tehlikeli, (B) sınıfı belgeye iş güvenliği uzmanı tehlikeli ve az tehlikeli, (C) sınıfı belgeye sahip iş güvenliği uzmanı ise sadece az tehlikeli sınıfta yer alan işyerlerinde görev yapabilmektedir. Bununla birlikte, bu genel kurala İş Sağlığı ve Güvenliği Hizmetleri Yönetmeliğinin 5 inci maddesinin üçüncü fıkrasıyla istisna getirilerek, birden fazla iş güvenliği uzmanı görevlendirilen kamu, maden, inşaat, metal, tekstil, sağlık, ulaşım, taşımacılık, ticaret, imalat, bakım, onarım, kurulum, enerji, kimya, tarım, ziraat, hayvancılık, mobilya, ormancılık, gıda, matbaa, atık yönetimi, su temini, temizlik, ilaçlama sektörlerine ait işyerlerinde, tam süreli iş güvenliği uzmanlarından sadece birisinde uygun belge sınıfı olması halinde diğerleri için uygun belge şartı aranmayacağı hükme bağlanmıştır. Diğer bir deyişle, bu kapsamda olan çok tehlikeli sınıfta yer alan işyerlerinde (B) ve (C) sınıfı iş güvenliği uzmanlığı belgesi sahibi olanlar sözleşme imzalayabilmekte ve tehlikeli sınıfta yer alan işyerlerinde ise (C) sınıfı iş güvenliği uzmanlığı belgesi sahibi olanlar sözleşme imzalayabilmektedir. Bu kapsamda üst sınıfta görev yapan kişilerin sayısı oldukça fazladır. <br/><br/>Ancak uygulamada yaşanan zorluklar nedeniyle 2015 yılında 6331 sayılı Kanuna eklenen geçici 4 üncü maddesinin birinci fıkrası ile mezkûr Kanunun 8 inci maddesinde belirtilen çok tehlikeli sınıfta yer alan işyerlerinde (A) sınıfı belgeye sahip iş güvenliği uzmanı görevlendirme yükümlülüğü, (B) sınıfı belgeye sahip iş güvenliği uzmanı görevlendirilmesi; tehlikeli sınıfta yer alan işyerlerinde ise (B) sınıfı belgeye sahip iş güvenliği uzmanı görevlendirme yükümlülüğü, (C) sınıfı belgeye sahip iş güvenliği uzmanı görevlendirilmesi kaydıyla 38 inci maddenin birinci fıkrasının (a) bendinin (1) numaralı alt bendinde yer alan yürürlük tarihine kadar yerine getirilmiş sayılır hükmü getirilmiştir. Diğer bir deyişle, (B) sınıfı belgeye sahip olanların bir üst sınıf olan (A) sınıfı belgeye sahip olanların sözleşme imzalayabilecekleri çok tehlikeli sınıfta, (C) sınıfı belgeye sahip olanların bir üst sınıf olan (B) sınıfı belgeye sahip olanların sözleşme imzalayabilecekleri tehlikeli sınıfta yer alan işyerleri ile iş güvenliği uzmanlığı sözleşmesi imzalama imkânı getirilmiştir. Bu kapsamda ilgili yıldan bugüne kadar bir üst sınıf işyerlerinde görev yapan kişi sayısı oldukça yüksektir. Ancak ilgili madde ile tanınan bu imkânın yürürlüğü 31/12/2024 tarihinde sona ermiş olup, bu kapsamdaki sözleşmeler İSG-KATİP sisteminde kendiliğinden iptal olmuştur. <br/><br/>Söz konusu açıklamalar çerçevesinde üst sınıfta fiilen üç yıl görev yapmış ve son vize döneminde hakkında herhangi bir idari yaptırım uygulanmamış olan iş güvenliği uzmanlarının yetkinlik ve deneyimlerinden faydalanmak amacıyla bu kapsamdakilere eğitim ve sınav şartı olmaksızın bir üst sınıf belge hakkı verilmesi öngörülmektedir. Yönetmeliğin genel kurgusuna bakıldığında görülecektir ki, ilgili eğitimi alma ve sonrasında ilgili sınavda başarılı olma şartı, ilgili alanda belirli bir çalışması ve tecrübesi olmayanlarla ilgilidir. Kısaca, eğitim daha önce tecrübe etmediği üst sınıftaki tehlike sınıfı hakkında bilgi edinmesi, sınav ise bu eğitim sonucunda yeterli bilgiye ulaşıp ulaşmadığını ölçmek içindir. Oysaki getirilen düzenlemede, ilgili kişiler halihazırda en az üç yıl üst sınıf tehlike sınıfında fiilen iş güvenliği uzmanı olarak görev yapmış ve bu görev zamanında da herhangi bir idari yaptırıma sebep olabilecek bir hata yapmamıştır. Kısaca, işbaşı eğitim gibi değerlendirildiğinde ilgili tehlike sınıfı için yeterli bilgiye ulaşma imkânı kazanmış ve idari yaptırımla karşılaşmayarak da yeterli bilgiye ulaştığını ispat etmiş bulunmaktadır. <br/><br/>Sonuç itibarıyla, yukarıdaki açıklamalar çerçevesinde en az üç yıl ve üzerinde kendi sınıfından üst tehlike sınıfında iş güvenliği uzman olarak görev yapan ve son vize döneminde de herhangi bir idari yaptırım (askı veya ihtar) almayan kişilere, kazandıkları yetkinlik ve tecrübeye binaen eğitim ve sınav şartı olmaksızın bir kereye mahsus yine kazandıkları yetkinlik ve tecrübeye uygun olarak bir üst sınıf belgesi verilmesi için, 6331 sayılı Kanunun 30 uncu maddesi ile Çalışma ve Sosyal Güvenlik Bakanlığına yönetmelikle düzenleme yetkisi verilen alanda ve belirlilik ilkesine de uygun bir şekilde geçici bir düzenleme yapılmıştır. <br/><br/><strong>2. Yardımcı İş Güvenliği Uzmanlığı Sözleşmelerinin Bu Kapsamda Değerlendirilmemesi Hususu: </strong><br/><br/>İş Güvenliği Uzmanlarının Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik'in 7 nci maddesinin beşinci fıkrasında yer alan “(5) (Ek:RG-30/4/2015-29342) İşveren, bu Yönetmelikte belirtilen zorunlu çalışma sürelerine bağlı kalmak şartıyla işyerinin tehlike sınıfına uygun olarak görevlendirilmesi zorunlu olan en az bir iş güvenliği uzmanının yanında, Kanunda ve Yönetmelikte belirtilen esas sorumluluklar saklı kalmak kaydıyla iş güvenliği uzmanına yardımcı olmak üzere, iş güvenliği uzmanlığı belgesine sahip ve işyerinin tam süreli sigortalı çalışanları arasından iş güvenliği uzmanı görevlendirmesi yapabilir.” hüküm gereğince işyerlerinde asıl görevlendirilen iş güvenliği uzmanına yardımcı olmak üzere yardımcı iş güvenliği uzmanlığı görevlendirmesi yapılabilmesi sağlanmıştır. <br/><br/>Bu fıkra kapsamında yapılan görevlendirmelerde fıkrada yer alan “Kanunda ve Yönetmelikte belirtilen esas sorumluluklar saklı kalmak kaydıyla” ifadesi kapsamında yardımcı iş güvenliği uzmanlarının işyerindeki iş sağlığı ve güvenliği konusunda yürütülen işlerde herhangi bir sorumluluğu ve yetkisi bulunmamaktadır. <br/><br/>Bu maddenin ana amacı özellikle çok tehlikeli sınıftaki işyerlerinde görev yapan ve C sınıfı belgeye sahip olan kişilerin bir üst belge sınıfına geçebilmeleri için çalıştıkları mevcut işyerinden ayrılmak zorunda kalmadan sürelerinin işletilebilmesi olup aynı Yönetmeliğin belgelendirme usul ve esaslarının belirlendiği 8 inci maddesinde ifade edilen “(C) sınıfı iş güvenliği uzmanlığı belgesiyle en az üç yıl fiilen görev yaptığını iş güvenliği uzmanlığı sözleşmesi ile belgeleyen ve (B) sınıfı iş güvenliği uzmanlığı eğitimine katılarak yapılacak (B) sınıfı iş güvenliği uzmanlığı sınavında başarılı olan mühendislik veya mimarlık eğitimi veren fakültelerin mezunları ile teknik elemanlara,” hüküm kapsamında eğitim ve sınav şartı sağlanmak koşuluyla fiili çalışma süresi hesabına yardımcı iş güvenliği uzmanlığı sözleşmeleri dahil edilmektedir. Bu kapsamda, yardımcı iş güvenliği uzmanı olarak görev yapan kişilerin, fiili çalışma süresini tamamlamış olmaları halinde eğitim katılmaları ve 2025 yılı Mayıs ile Aralık aylarında yapılacak sınavlarda başarılı olmaları halinde bir üst sınıftaki belgeyi alma hakları bulunmaktadır. <br/><br/>Bununla birlikte, İş Güvenliği Uzmanlarının Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik 9, 10 ve 11’nci maddelerinde iş güvenliği uzmanlarının görev, yetki ve yükümlülükleri tanımlanmakta olup bu görev, yetki, yükümlülükler kapsamında herhangi bir ihlal tespit edilmesi halinde aynı Yönetmeliğin 33 ve 34 üncü maddeleri gereğince kişilere ihtar puanı veya askıya alma cezası uygulanmaktadır. Ancak, yardımcı iş güvenliği uzmanı olarak görevlendirilen kişiler için Yönetmelik içinde belirlenmiş herhangi bir görev, yetki veya sorumluluğu tanımlanmamış olduğundan bu kişilere yaptıkları işlerden dolayı herhangi bir şekilde ihtar puanı veya askıya alma cezası gibi idari bir işlem uygulanması ihtimali de yoktur. <br/><br/>27/12/2024 tarihinde yapılan düzenleme ile yürürlüğe giren geçici 9 uncu madde hükmünden de anlaşılacağı üzere, bir üst belge verilebilmesi için iki şartın birlikte sağlanması gerekmektedir. Bunlar; <br/><br/>31/12/2024 tarihi itibarıyla iş güvenliği belgesiyle, kendi belge sınıfından daha üst bir tehlike sınıfındaki işyerinde İSG-KATİP’te kayıtlı bir İGU sözleşmesiyle en az üç yıl fiilen görev yaptığını belgelemek. <br/><br/>Son vize döneminde herhangi bir ihtar puanı veya askıya alma işlemi uygulanmamış olmak. <br/><br/>Bu düzenlemenin ana amacı, hali hazırda en az üç yıl üst sınıf tehlike sınıfında fiilen iş güvenliği uzmanı olarak görev yapmış, asli olarak yaptığı görevin tüm sorumluluğunu üstlenmiş, mevzuattaki tüm yükümlülüklerini yerine getirmiş ve bu görevleri yaparken de herhangi bir idari yaptırıma sebep olabilecek bir hata yapmamış kişilerin edindikleri deneyimin dikkate alınarak bir üst belgenin verilmesidir. <br/><br/>Oysaki yardımcı iş güvenliği uzmanı olarak görev yapan kişilerin, işyerlerinde herhangi bir yetkisi ve sorumluluğu olmaması sebebiyle (Risk değerlendirmesi yapılması, eğitimlerin verilmesi ve benzeri görevleri yerine getirme ve bunlara imza yetkisi bulunmamaktadır.) iş sağlığı ve güvenliği açısından işyerinde yapılması gereken asli işlerde görev alma şansı olmadığından kişinin yetkinlik kazanıp kazanmadığının ölçülebilme şansı yoktur. Bu sebeple de bahse konu geçici madde ile bir üst belge verme şartlarından olan herhangi bir idari yaptırım almamış olmaları şartını yerine getirme ihtimalleri bulunmamaktadır. <br/><br/>Sonuç olarak, yukarıda yapılan açıklamalar ve ilgili mevzuat çerçevesinde, her iki şartı birlikte yerine getirme ihtimali olmayan, diğer bir deyişle ilgili sözleşme dönemi boyunca herhangi bir yetki ve sorumluluğu olmayıp bu kapsamda herhangi bir idari yaptırımla muhatap kalma ihtimali bulunmayan yardımcı iş güvenliği uzmanlığı sözleşme süreleri, geçici 9 uncu madde kapsamında kazanılan yetkinlik ve tecrübeye binaen eğitim ve sınav şartı olmaksızın bir kereye mahsus yine kazanılan yetkinlik ve tecrübeye uygun olarak bir üst sınıf belgesi verilmesi için dikkate alınmamıştır.<br/><br/>Bilgilerinize sunulur."
        }
    };
    let $select = $('<select>', { id: 'duyuruListesi', size: 5 });
    $.each(duyurular, (k, v) => $select.append($('<option>', { value: k, text: v.baslik })));  
    $('#duyurusecimanasayfa').append($select);
    $select.on('change', () =>
    {
        const secilen = $select.val();  
        $('#duyuruaciklamakutu').html(duyurular[secilen]?.metin || "Açıklama yok.").show();  
    });
}

function datepickerjquery(input) {
    $.datepicker.setDefaults({
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        changeMonth: true,
        changeYear: true,
        dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
        dayNamesMin: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
        monthNamesShort: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        nextText: "İleri",
        prevText: "Geri",
        beforeShow: function() {
            setTimeout(function ()
            {
                $('.ui-datepicker td a').css({
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'text-align': 'center',
                    'width': '100%',
                    'height': '100%'
                });
            }, 1);
        }
    });    
    $(input).datepicker();
    setTimeout(function () {$(input).datepicker("show");}, 10);
}

















