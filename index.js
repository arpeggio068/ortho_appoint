// -------------------------- Web Page Load Func ----------------------------------------------------
// -------------------------- Web Page Load Func ----------------------------------------------------
    async function include(fileName, elementId) {
        try {
            const response = await fetch(fileName);

            if (!response.ok) {
                throw new Error(
                    `โหลด ${fileName} ไม่สำเร็จ: HTTP ${response.status}`
                );
            }

            const html = await response.text();

            const targetElement = document.getElementById(elementId);

            if (!targetElement) {
                throw new Error(`ไม่พบ element id="${elementId}"`);
            }

            targetElement.innerHTML = html;

            return targetElement;

        } catch (error) {
            console.error("include error:", error);
            throw error;
        }
    }

function loadAddForm() {
      const datePattern =
    '(0[1-9]|1[0-9]|2[0-9])/(0[1-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|29/(0[13-9]|1[0-2])/(?:19|20)(?:0[48]|[2468][048]|[13579][26])' +
    '|30/(0[13-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|31/(0[13578]|1[02])/(?:19|20)[0-9]{2}';
        return `
            <form class="add-surg-form" id="addSurgForm" novalidate>

                <div class="row my-3">
                    <div class="col">
                        <h4 class="add-form-title">นัดศัลยกรรมกระดูก</h4>
                    </div>
                </div>

                <div class="row my-3">

                    <div class="col">
                        <label>HN</label>

                        <input
                            type="number"
                            id="hn"
                            class="form-control"
                            placeholder="HN เฉพาะ รพร.เชียงของ เป็นค่าว่างได้"
                        >
                    </div>                    

                </div>

                <div class="row my-3">                    

                    <div class="col">
                        <label>ชื่อ-สกุล</label>

                        <input
                            type="text"
                            id="name"
                            class="form-control"
                            placeholder="ชื่อ นามสกุล ของผู้ป่วย"
                            required
                        >

                        <div class="invalid-feedback">
                            จำเป็น
                        </div>
                    </div>

                </div>

                <div class="row my-3">

                    <div class="col">
                        <label>เบอร์โทร</label>

                        <input
                            type="text"
                            id="tel"
                            class="form-control"
                            placeholder="เบอร์โทรศัพท์มือถือของผู้ป่วย"
                            pattern="[0][0-9]{2}-[0-9]{7}"
                            oninput="this.value = phoneFormat(this.value)"
                            required
                        >

                        <div class="invalid-feedback">
                            รูปแบบ เช่น 088-5559999
                        </div>
                    </div>                   

                </div>

                <div class="row my-3">                    

                    <div class="col">
                        <label>วันนัด</label>

                        <input
                            value=""
                            name="date"
                            id="date"
                            type="text"
                            class="form-control chk_date"
                            placeholder="เลือกวันนัด"
                            pattern="${datePattern}"
                            onchange="return validateDateLeapYear()"
                            required
                        >

                        <div class="invalid-feedback">
                            เลือกวันที่จากปฏิทินเท่านั้น
                        </div>

                        <p id="showRemain" style="color:blue;"></p>
                    </div>

                </div>

                <div class="row my-3">
                    <div class="col">

                        <button
                            id="btn1"
                            type="submit"
                            class="btn btn-primary"
                        >
                            บันทึก
                        </button>

                        <span
                            id="resp-spinner1"
                            class="spinner-grow spinner-grow-sm text-danger d-none"
                            role="status"
                            aria-hidden="true"
                        ></span>

                        <span
                            id="resp-spinner2"
                            class="spinner-grow spinner-grow-sm text-warning d-none"
                            role="status"
                            aria-hidden="true"
                        ></span>

                        <span
                            id="resp-spinner3"
                            class="spinner-grow spinner-grow-sm text-info d-none"
                            role="status"
                            aria-hidden="true"
                        ></span>

                    </div>
                </div>

            </form>
        `;
}

function loadSearchForm() {
  const datePattern =
    '(0[1-9]|1[0-9]|2[0-9])/(0[1-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|29/(0[13-9]|1[0-2])/(?:19|20)(?:0[48]|[2468][048]|[13579][26])' +
    '|30/(0[13-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|31/(0[13578]|1[02])/(?:19|20)[0-9]{2}';

  return `
    <div class="search-page" id="search_el">

      <div class="card search-card shadow-sm">

        <div class="card-body">

          <div class="search-header">
            <h4 id="card-head" class="search-title">
              แก้ไข/พิมพ์ใบนัด
            </h4>

            <div class="search-input-box">
              <input
                type="text"
                class="form-control form-control-lg"
                id="searchInput"
                placeholder="ค้นหาด้วย ชื่อ หรือ นามสกุล"
                autocomplete="off"
              >
            </div>
          </div>

          <div class="table-responsive search-table-wrapper">
            <table class="table table-bordered table-hover align-middle search-table">

              <thead class="table-light">
                <tr>
                  <th scope="col" class="col-name">ชื่อ-สกุล</th>
                  <th scope="col" class="col-hn">HN</th>
                  <th scope="col" class="col-date">วันที่</th>
                  <th scope="col" class="col-user">ผู้นัด</th>
                  <th scope="col" class="col-action">ใบนัด/แก้ไข</th>
                  <th scope="col" class="col-delete">ลบ</th>
                </tr>
              </thead>

              <tbody id="searchResults"></tbody>

            </table>
          </div>

        </div>

      </div>

      <template id="rowTemplate">
        <tr class="result-box">

          <td class="name text-start"></td>

          <td class="hn text-center"></td>

          <td class="date text-center text-nowrap"></td>

          <td class="user text-center"></td>

          <td class="text-center">
            <div class="action-buttons">

              <button
                type="button"
                class="btn btn-success btn-sm print-button"
              >
                ใบนัด
              </button>

              <button
                type="button"
                class="btn btn-primary btn-sm edit-button"
              >
                แก้ไข
              </button>

            </div>
          </td>

          <td class="text-center">
            <div class="delete-buttons">

              <button
                type="button"
                class="btn btn-warning btn-sm delete-button d-none"
              >
                ยืนยัน
              </button>

              <button
                type="button"
                class="btn btn-danger btn-sm before-delete-button"
                data-button-state="delete"
              >
                ลบ
              </button>

            </div>
          </td>

        </tr>
      </template>

    </div>


    <form class="add-surg-form" id="addSurgForm" novalidate>

                <div class="row my-3">
                    <div class="col">
                        <h4 class="add-form-title">แก้ไขนัดศัลยกรรมกระดูก</h4>
                    </div>
                </div>

                <div class="row my-3">
                    <input value="" type="hidden" id="data_id">  
                    <div class="col">
                        <label>HN</label>

                        <input
                            type="number"
                            id="hn"
                            class="form-control"
                            placeholder="HN เฉพาะ รพร.เชียงของ เป็นค่าว่างได้"
                        >
                    </div>                    

                </div>

                <div class="row my-3">                    

                    <div class="col">
                        <label>ชื่อ-สกุล</label>

                        <input
                            type="text"
                            id="name"
                            class="form-control"
                            placeholder="ชื่อ นามสกุล ของผู้ป่วย"
                            required
                        >

                        <div class="invalid-feedback">
                            จำเป็น
                        </div>
                    </div>

                </div>

                <div class="row my-3">

                    <div class="col">
                        <label>เบอร์โทร</label>

                        <input
                            type="text"
                            id="tel"
                            class="form-control"
                            placeholder="เบอร์โทรศัพท์มือถือของผู้ป่วย"
                            pattern="[0][0-9]{2}-[0-9]{7}"
                            oninput="this.value = phoneFormat(this.value)"
                            required
                        >

                        <div class="invalid-feedback">
                            รูปแบบ เช่น 088-5559999
                        </div>
                    </div>                   

                </div>

                <div class="row my-3">                    

                    <div class="col">
                        <label>วันนัด</label>

                        <input
                            value=""
                            name="date"
                            id="date"
                            type="text"
                            class="form-control chk_date"
                            placeholder="เลือกวันนัด"
                            pattern="${datePattern}"
                            onchange="return validateDateForEdit()"
                            required
                        >

                        <div class="invalid-feedback">
                            เลือกวันที่จากปฏิทินเท่านั้น
                        </div>

                        <p id="showRemain" style="color:blue;"></p>
                    </div>

                </div>

                <div class="row my-3">
                    <div class="col">

                        <div class="edit-action-buttons">
                            <button
                                id="btn1"
                                type="submit"
                                class="btn btn-success edit-action-btn"
                            >
                                แก้ไข
                            </button>

                            <button
                                id="btn2"
                                type="button"
                                class="btn btn-danger edit-action-btn"
                                onclick="showSearchEl()"
                            >
                                ยกเลิก
                            </button>
                        </div>

                        <div class="edit-spinner-box">
                            <span
                                id="resp-spinner1"
                                class="spinner-grow spinner-grow-sm text-danger d-none"
                                role="status"
                                aria-hidden="true"
                            ></span>

                            <span
                                id="resp-spinner2"
                                class="spinner-grow spinner-grow-sm text-warning d-none"
                                role="status"
                                aria-hidden="true"
                            ></span>

                            <span
                                id="resp-spinner3"
                                class="spinner-grow spinner-grow-sm text-info d-none"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        </div>

                    </div>
              </div>

     </form>
  `;
}  


function loadSurgTableView() {
  const datePattern =
    '(0[1-9]|1[0-9]|2[0-9])/(0[1-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|29/(0[13-9]|1[0-2])/(?:19|20)(?:0[48]|[2468][048]|[13579][26])' +
    '|30/(0[13-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|31/(0[13578]|1[02])/(?:19|20)[0-9]{2}';

  return `
    <div class="surg-table-page">

      <form id="surgTable" class="surg-search-form" novalidate>
        <h4 class="surg-title">
          รายการนัดศัลยกรรมกระดูก
          <span>(เลือกวัน)</span>
        </h4>

        <div class="row g-2 align-items-start">

          <div class="col-12 col-md-5">
            <input
              name="date"
              id="date1"
              type="text"
              class="form-control holidate"
              placeholder="วันเริ่มต้น"
              pattern="${datePattern}"
              onchange="return validateDateSurgTable()"
              required
            >

            <div id="date1-feedback" class="invalid-feedback">
              เลือกวันที่จากปฏิทินเท่านั้น
            </div>
          </div>

          <div class="col-12 col-md-5">
            <input
              name="date"
              id="date2"
              type="text"
              class="form-control holidate"
              placeholder="วันสิ้นสุด"
              pattern="${datePattern}"
              onchange="return validateDateSurgTable()"
              required
            >

            <div id="date2-feedback" class="invalid-feedback">
              เลือกวันที่จากปฏิทินเท่านั้น
            </div>
          </div>

          <div class="col-12 col-md-2">
            <button
              id="btn1"
              type="submit"
              class="btn btn-primary w-100"
            >
              ตกลง
            </button>
          </div>

        </div>

        <div class="surg-loading mt-2">
          <span
            id="resp-spinner1"
            class="spinner-grow spinner-grow-sm text-danger d-none"
            role="status"
            aria-hidden="true"
          ></span>

          <span
            id="resp-spinner2"
            class="spinner-grow spinner-grow-sm text-warning d-none"
            role="status"
            aria-hidden="true"
          ></span>

          <span
            id="resp-spinner3"
            class="spinner-grow spinner-grow-sm text-info d-none"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      </form>

      <div id="showSurgTable" class="d-none mt-4">

        <div class="d-flex justify-content-end mb-2">
          <button
            id="btn2"
            type="button"
            class="btn btn-success btn-sm px-3"
            onclick="printSurgTable()"
          >
            พิมพ์
          </button>
        </div>

        <div id="surg_table" class="table-responsive"></div>
      </div>

    </div>
  `;
}


function loadAddHolidayForm() {
  const datePattern =
    '(0[1-9]|1[0-9]|2[0-9])/(0[1-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|29/(0[13-9]|1[0-2])/(?:19|20)(?:0[48]|[2468][048]|[13579][26])' +
    '|30/(0[13-9]|1[0-2])/(?:19|20)[0-9]{2}' +
    '|31/(0[13578]|1[02])/(?:19|20)[0-9]{2}';

  return `
    <div class="holiday-page">

      <section class="holiday-card">
        <div class="holiday-card-header">
          <div>
            <h4 class="holiday-card-title">
              📅 บันทึกวันหยุด
            </h4>

            <p class="holiday-card-subtitle">
              เพิ่มวันที่และชื่อวันหยุดที่ต้องการปิดรับนัด
            </p>
          </div>
        </div>

        <div class="holiday-card-body">
          <form id="addHolidaysForm" novalidate>

            <div class="row g-3">
              <div class="col-12 col-md-5">
                <label for="date" class="holiday-form-label">
                  วันที่
                  <span class="required">*</span>
                </label>

                <input
                  name="date"
                  id="date"
                  type="text"
                  class="form-control chk_date"
                  placeholder="เลือกวันหยุด"
                  pattern="${datePattern}"
                  onchange="return validateDateHoliday()"
                  autocomplete="off"
                  required
                >

                <div class="invalid-feedback">
                  เลือกวันที่จากปฏิทินเท่านั้น
                </div>
              </div>

              <div class="col-12 col-md-7">
                <label for="name" class="holiday-form-label">
                  ชื่อวันหยุด
                  <span class="required">*</span>
                </label>

                <input
                  type="text"
                  id="name"
                  class="form-control"
                  placeholder="ชื่อวันหยุด เช่น วันขึ้นปีใหม่"
                  autocomplete="off"
                  required
                >

                <div class="invalid-feedback">
                  กรุณาระบุชื่อวันหยุด
                </div>
              </div>
            </div>

            <div class="holiday-save-row">
              <button
                id="btn1"
                type="submit"
                class="btn btn-primary holiday-save-btn"                
              >
                บันทึก
              </button>

              <div class="holiday-loading">
                <span
                  id="resp-spinner1"
                  class="spinner-grow spinner-grow-sm text-danger d-none"
                  role="status"
                  aria-hidden="true"
                ></span>

                <span
                  id="resp-spinner2"
                  class="spinner-grow spinner-grow-sm text-warning d-none"
                  role="status"
                  aria-hidden="true"
                ></span>

                <span
                  id="resp-spinner3"
                  class="spinner-grow spinner-grow-sm text-info d-none"
                  role="status"
                  aria-hidden="true"
                ></span>
              </div>
            </div>

          </form>
        </div>
      </section>

      <section class="holiday-list-card">
        <div id="table_holidays"></div>
      </section>

    </div>
  `;
}
    
   
async function setAddForm() {
        console.log("เริ่ม setAddForm");
      try {       
        const id = getTokenFromUrl();

        if (!id) {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล web ไม่ถูกต้อง',
                text: 'ไม่พบข้อมูล web id',
                showConfirmButton: true,
                timer: 2500
            });

            return;
        }

        const payload = {
            id: id,            
        };

        const fd = new FormData();

        fd.append('action', 'reloadAddRecForm');
        fd.append('data', JSON.stringify(payload));

        const res = await api(mainUrl, {
            method: 'POST',
            redirect: 'follow',
            mode: 'cors',
            body: fd
        });

        // console.log('reloadAddRecForm response:', res);

        if (!res) {
            throw new Error('ไม่พบข้อมูลตอบกลับจากหน้าบันทึกข้อมูล');
        }

        if (res.status === 'token_error') {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล web id ไม่ถูกต้อง',
                text: res.message || 'โปรดตรวจสอบ web link',
                showConfirmButton: true,
                timer: 2500
            });

            return;
        }        

        const reloadAddRecFormOK = res.status === 'success' ;

        if (!reloadAddRecFormOK) {
            throw new Error(
                res.message || 'ระบบไม่สามารถโหลดข้อมูลเริ่มต้นได้'
            );
        }
        /*
         * เก็บข้อมูลล่าสุดจาก API
         */
        gEmptyQ = res.emptyQ || [];

        populateDates(
            res.disabledDays || [],
            res.firstDate
        );

        populateNames(gNameArr);
        populateTels(gTelArr);
      

    } catch (error) {
        console.error('setAddForm error:', error);

        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'โหลดข้อมูลเริ่มต้นไม่สำเร็จ',
            text: error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลเริ่มต้น',
            showConfirmButton: true
        });

    } finally {
        loadingEnd()
    }
        

     console.log("setAddForm เรียบร้อย");
  }
    
  async function showAddForm(event = null, loadConfig = true) {
    if (event) {
        event.preventDefault();
    }

    try {
        loadingStart();

        $("#app").html(loadAddForm());

        setActiveNav("addsurg-link");

        /*
         * ตอนเริ่มเปิดเว็บ loadConfig = false
         * หลัง Login แล้ว หรือกดเมนูบันทึกนัด loadConfig = true
         */
        if (loadConfig && gIsLoggedIn) {
            await setAddForm();
        }

        $("#addSurgForm")
            .off("submit")
            .on("submit", async function (event) {
                event.preventDefault();
                await addRecord(event);
            });

    } catch (error) {
        console.error("showAddForm error:", error);

        await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message || "ไม่สามารถเปิดหน้าบันทึกนัดได้"
        });

    } finally {
        loadingEnd();
    }
}



async function setSearchForm() {
    console.log("เริ่ม setSearchForm");

    try {
        const id = getTokenFromUrl();

        if (!id) {
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "ข้อมูล web ไม่ถูกต้อง",
                text: "ไม่พบข้อมูล web id",
                showConfirmButton: true,
                timer: 2500
            });

            return false;
        }

        const payload = {
            id: id
        };

        const fd = new FormData();

        fd.append("action", "apiDataForSearch");
        fd.append("data", JSON.stringify(payload));

        const res = await api(mainUrl, {
            method: "POST",
            redirect: "follow",
            mode: "cors",
            body: fd
        });

        // console.log("apiDataForSearch response:", res);

        if (!res) {
            throw new Error("ไม่พบข้อมูลตอบกลับจากหน้าค้นหานัด");
        }

        if (res.status === "token_error") {
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "ข้อมูล web id ไม่ถูกต้อง",
                text: res.message || "โปรดตรวจสอบ web link",
                showConfirmButton: true,
                timer: 2500
            });

            return false;
        }

        if (res.status !== "success") {
            throw new Error(
                res.message || "ระบบไม่สามารถโหลดข้อมูลค้นหาได้"
            );
        }

        gSearchObjMain = Array.isArray(res.data)
            ? res.data
            : [];

        /*
         * userId 001 เห็นข้อมูลทั้งหมด
         * user อื่นเห็นเฉพาะข้อมูลที่ตนเองบันทึก
         */
        if (gUserId !== "001") {
            gCupData = gSearchObjMain.filter(
                row => row[6] === gUser_name
            );
        } else {
            gCupData = gSearchObjMain;
        }

        gSearchData = gCupData.slice();

        gEmptyQ = res.emptyQ || [];

        gDisabledDaysArray = Array.isArray(res.disabledDays)
            ? res.disabledDays
            : [];

        gFirstDate = res.firstDate || "";
        populateDates(gDisabledDaysArray, gFirstDate);
        letGoTrim();  

        console.log("setSearchForm เรียบร้อย");

        return true;

    } catch (error) {
        console.error("setSearchForm error:", error);

        await Swal.fire({
            position: "center",
            icon: "error",
            title: "โหลดข้อมูลค้นหาไม่สำเร็จ",
            text: error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลค้นหา",
            showConfirmButton: true
        });

        return false;
    }
}


async function showSearchForm(event = null) {
    if (event) {
        event.preventDefault();
    }

    if (!gIsLoggedIn) {
        return;
    }

    try {
        loadingStart();

        /*
         * สร้างหน้า Search ก่อน
         */
        $("#app").html(loadSearchForm());
        //search_el addSurgForm
        $("#search_el").show()
        $("#addSurgForm").hide()
        /*
         * กำหนด active ให้เมนูแก้ไข/พิมพ์ใบนัด
         */
        setActiveNav("editsurg-link");

        /*
         * โหลดข้อมูลจาก API
         */
        const loaded = await setSearchForm();

        if (!loaded) {
            return;
        }

        /*
         * ผูก event ค้นหา หลังจาก #searchInput ถูกสร้างแล้ว
         */
        $("#searchInput")
            .off("input")
            .on("input", search);

        /*
         * ให้ cursor อยู่ในช่องค้นหา
         */
        document.getElementById("searchInput")?.focus();

        $("#addSurgForm")
            .off("submit")
            .on("submit", async function (event) {
                event.preventDefault();
                await editData(event);
            });

    } catch (error) {
        console.error("showSearchForm error:", error);

        await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message || "ไม่สามารถเปิดหน้าค้นหานัดได้"
        });

    } finally {
        loadingEnd();
    }
}


async function setTableForm() {
    populateSurgTableDates()
}


async function showTableForm(event) {
    if (event) {
        event.preventDefault();
    }

    if (!gIsLoggedIn) {
        return;
    }

    try {
        loadingStart();
        
        $("#app").html(loadSurgTableView());
        
        await setTableForm();       
        
       
        //document.getElementById("date1")?.focus();

        $("#surgTable")
            .off("submit")
            .on("submit", async function (event) {
                event.preventDefault();
                await clickShowTable(event);
            });

    } catch (error) {
        console.error("showTableForm error:", error);

        await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message || "ไม่สามารถเปิดหน้าตารางนัดได้"
        });

    } finally {
        loadingEnd();
    }
}


async function setHolidaysForm(){
    console.log("เริ่ม setHolidaysForm");

    try {
        const id = getTokenFromUrl();

        if (!id) {
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "ข้อมูล web ไม่ถูกต้อง",
                text: "ไม่พบข้อมูล web id",
                showConfirmButton: true,
                timer: 2500
            });

            return false;
        }

        const payload = {
            id: id
        };

        const fd = new FormData();

        fd.append("action", "apiLoadAddHoliday");
        fd.append("data", JSON.stringify(payload));

        const res = await api(mainUrl, {
            method: "POST",
            redirect: "follow",
            mode: "cors",
            body: fd
        });

        // console.log("apiDataForSearch response:", res);

        if (!res) {
            throw new Error("ไม่พบข้อมูลตอบกลับจากหน้าจัดการวันหยุด");
        }

        if (res.status === "token_error") {
            await Swal.fire({
                position: "center",
                icon: "error",
                title: "ข้อมูล web id ไม่ถูกต้อง",
                text: res.message || "โปรดตรวจสอบ web link",
                showConfirmButton: true,
                timer: 2500
            });

            return false;
        }

        if (res.status !== "success") {
            throw new Error(
                res.message || "ระบบไม่สามารถโหลดข้อมูลเริ่มต้นได้"
            );
        }
        

        gHolidaysAll = Array.isArray(res.holidaysAll)
            ? res.holidaysAll
            : [];

        gHolidays = Array.isArray(res.holidays)
            ? res.holidays
            : [];

        showHolidayTable(gHolidaysAll)
        populateHolidays(gHolidays);
        letGoTrim();  

        console.log("setHolidaysForm เรียบร้อย");

        return true;

    } catch (error) {
        console.error("setHolidaysForm error:", error);

        await Swal.fire({
            position: "center",
            icon: "error",
            title: "โหลดข้อมูลเริ่มต้นไม่สำเร็จ",
            text: error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลเริ่มต้น",
            showConfirmButton: true
        });

        return false;
    }

}



async function showAddHolidaysForm(event){

  if (event) {
        event.preventDefault();
    }

    if (!gIsLoggedIn) {
        return;
    }

    try {
        loadingStart();
        
        $("#app").html(loadAddHolidayForm());
        
        await setHolidaysForm();       
        
       
        //document.getElementById("date1")?.focus();

        $("#addHolidaysForm")
            .off("submit")
            .on("submit", async function (event) {
                event.preventDefault();
                await addHoliday(event);
            });

    } catch (error) {
        console.error("showTableForm error:", error);

        await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message || "ไม่สามารถเปิดหน้าตารางนัดได้"
        });

    } finally {
        loadingEnd();
    }
}


//

// -------------------------- Web Page Load Func ----------------------------------------------------
// -------------------------- Web Page Load Func ----------------------------------------------------



//------------------------------------ event config ------------------------------------------------------
function setActiveNav(activeId) {

        document
            .querySelectorAll(".main-nav .nav-link")
            .forEach(navLink => {
                navLink.classList.remove("active");
            });

        const activeLink = document.getElementById(activeId);

        if (activeLink) {
            activeLink.classList.add("active");
        }
}


function setupNavbarEvents() {
    $("#addsurg-link")
        .off("click")
        .on("click", async function (event) {
            event.preventDefault();

            if (!gIsLoggedIn) {
                return;
            }

            await showAddForm(null, true);
        });


    $("#editsurg-link")
    .off("click")
    .on("click", async function (event) {
        event.preventDefault();

        if (!gIsLoggedIn) {
            return;
        }

        await showSearchForm();
    });


    $("#tablesurg-link")
        .off("click")
        .on("click", async function (event) {
            event.preventDefault();

            if (!gIsLoggedIn) {
                return;
            }

            setActiveNav("tablesurg-link");

            // ใส่ภายหลัง
            await showTableForm();
        });

      $("#holidays-link")
        .off("click")
        .on("click", async function (event) {
            event.preventDefault();

            if (!gIsLoggedIn) {
                return;
            }  //navbarDropdown

            setActiveNav("navbarDropdown");

            if(gUserLevel !== 'admin'){
              Swal.fire({
                      position: 'center',
                      icon: 'warning',
                      title: 'คุณไม่มีสิทธิใช้งาน!',
                      showConfirmButton: true,
                      timer: 3000
                    }) 

              return

            }           

            
            await showAddHolidaysForm();
        });  
}


function displayConfirmationDelete(e){
      
        if( e.target.dataset.buttonState ==="delete"){
        e.target.previousElementSibling.classList.remove("d-none");
        e.target.textContent= "ยกเลิก";
        e.target.dataset.buttonState = "cancel";
        }else{
            e.target.previousElementSibling.classList.add("d-none");
            e.target.textContent= "ลบ";
            e.target.dataset.buttonState = "delete";
        }
  }

  function clickEventHandler(e){
       

       if(e.target.matches(".before-delete-button")){
         displayConfirmationDelete(e);        
       }

       if(e.target.matches(".print-button")){
         printData(e);        
       }     

       if(e.target.matches(".delete-button")){
         deleteData(e);        
       }       
       
       if(e.target.matches(".edit-button")){
         afterEditViewLoads(e)
               
       }      
       
        
       
  }

   
async function initializeApp() {
    try {
        await Promise.all([
            include("login.html", "login"),
            include("navbar.html", "mainavbar")
        ]);

        setupNavbarEvents();

        /*
         * แสดง Add Form ไว้ก่อน
         * แต่ยังไม่เรียก API setAddForm()
         */
        await showAddForm(null, false);

    } catch (error) {
        console.error("initializeApp error:", error);

        await Swal.fire({
            icon: "error",
            title: "เริ่มต้นระบบไม่สำเร็จ",
            text: error.message || "ไม่สามารถโหลดข้อมูลเริ่มต้นได้"
        });
    }
}

//------------------------------------ event config ------------------------------------------------------


// -------------------------- Web Page Load Func ----------------------------------------------------
// -------------------------- Web Page Load Func ----------------------------------------------------
   



//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------//   
function loadingStart(){
      document.getElementById("loading").classList.remove("invisible");
  }
       
  function loadingEnd(){
      document.getElementById("loading").classList.add("invisible");
  }

  function showSpin3(){
    document.getElementById('resp-spinner1').classList.remove("d-none");
    document.getElementById('resp-spinner2').classList.remove("d-none");
    document.getElementById('resp-spinner3').classList.remove("d-none");
  }

  function hideSpin3(){
    document.getElementById('resp-spinner1').classList.add("d-none");
    document.getElementById('resp-spinner2').classList.add("d-none");
    document.getElementById('resp-spinner3').classList.add("d-none");
  } 

//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------//   

//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 

  function trim_text(el) {
    el.value = el.value.
    replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
    replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space
    replace(/\n +/, "\n"); // Removes spaces after newlines
    return;
  }

  function letGoTrim(){
    $(function(){
      $("textarea").change(function(){
        trim_text(this);
      });

      $("input").change(function(){
        trim_text(this);
      });
    });
  }

  function checkLeapYears(input){  
    year = parseInt(input); 
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)){      
      return true;      
    }else{
          return false;      
         }  
  }  

  function isFloat(n){
    return n != "" && !isNaN(n) && Math.round(n) != n;
  }

  function isInt(n){
    return n != "" && !isNaN(n) && Math.round(n) == n;
  }

  function phoneFormat(input) {//returns (###) ###-####
          input = input.replace(/\D/g,'');
          let size = input.length;
          if (size>3) {input=input.slice(0,3)+"-"+input.slice(3,10)}
          
          return input;
  } 

  function thaiDay(day){
    let thai_day; 
      switch(day) {
        case 0: thai_day = "อาทิตย์";        
          break;
        case 1: thai_day ="จันทร์";        
          break;
        case 2: thai_day = "อังคาร";        
          break;
        case 3: thai_day = "พุธ";        
          break;
        case 4: thai_day = "พฤหัส";        
          break;
        case 5: thai_day = "ศุกร์";        
          break;
        case 6: thai_day = "เสาร์";        
          break;
      
      }      
    return thai_day;                       
  }

  function thaiMonth(month){
    let thai_month; 
      switch(month) {
        case 0: thai_month = "มกราคม";        
          break;
        case 1: thai_month ="กุมภาพันธ์";        
          break;
        case 2: thai_month = "มีนาคม";        
          break;
        case 3: thai_month = "เมษายน";        
          break;
        case 4: thai_month = "พฤษภาคม";        
          break;
        case 5: thai_month = "มิถุนายน";        
          break;
        case 6: thai_month = "กรกฎาคม";        
          break;
        case 7: thai_month = "สิงหาคม";        
          break;
        case 8: thai_month = "กันยายน";        
          break;
        case 9: thai_month = "ตุลาคม";        
          break;
        case 10: thai_month = "พฤศจิกายน";        
          break; 
        case 11: thai_month = "ธันวาคม";        
          break;           
      
      }      
    return thai_month;                       
  }

  function colorDay(val){
     let color;
     switch(val) {
        case 0: color = "color:red";      
          break;
        case 1: color = "color:#D68910";        
          break;
        case 2: color = "color:magenta";      
          break;
        case 3: color = "color:green";     
          break;
        case 4: color = "color:brown";      
          break;
        case 5: color = "color:blue";       
          break;
        case 6: color = "color:#A907E1";       
          break;        
        default: color = "color:black"; 
      }      
    return color;      
  }

  function convertDateStr(str){
    return str.split('/')[2]+"/"+str.split('/')[1]+"/"+str.split('/')[0]
  }  

  function addDayToCurrentDate(days){
    const currentDate = new Date();
    return new Date(currentDate.setDate(currentDate.getDate() + days)).setHours(0,0,0,0);
  }

  function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }



  function getTokenFromUrl() {
    return new URLSearchParams(window.location.search).get("id") || "";  
  }


function getAssetUrl(path) {
  const projectBaseUrl = new URL('./', window.location.href);

  return new URL(
    String(path).replace(/^\/+/, ''),
    projectBaseUrl
  ).href;
}

  
//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 


//----------------------------------- Validate Func -----------------------------------------------//
//----------------------------------- Validate Func -----------------------------------------------//
function validateLogin(){
      const form = document.getElementById("loginform");

        // ตรวจสอบความถูกต้อง
      const isValid = form.checkValidity();

        // เพิ่ม class ให้ Bootstrap ทำงาน (ทันที)
      form.classList.add('was-validated');

      return isValid;
   }
  

  function validateAddForm(){
    const form = document.getElementById("addSurgForm")
    
    const isValid = form.checkValidity();

    form.classList.add('was-validated');

    return isValid;
  }

  function validateAddHolidays(){   
    
    const form = document.getElementById("addHolidaysForm")
    
    const isValid = form.checkValidity();

    form.classList.add('was-validated');

    return isValid;
  }  


function validateDateSurgTable() {
  const dateInput1 = document.getElementById('date1');
  const dateInput2 = document.getElementById('date2');
  const inputDates = document.querySelectorAll('.holidate');

  const defaultMessage = 'เลือกวันที่จากปฏิทินเท่านั้น';

  // ล้างสถานะจากการตรวจครั้งก่อน
  inputDates.forEach(el => {
    el.setCustomValidity('');
    el.classList.remove('is-invalid');

    const feedback = document.getElementById(`${el.id}-feedback`);

    if (feedback) {
      feedback.textContent = defaultMessage;
    }
  });

  // ตรวจสอบรูปแบบและปีอธิกสุรทิน
  for (const el of inputDates) {
    // ยังไม่เลือก ไม่ต้องแสดง invalid ใน onchange
    if (el.value === '') {
      continue;
    }

    const feedback = document.getElementById(`${el.id}-feedback`);
    const [date, month, year] = el.value.split('/').map(Number);

    if (
      checkLeapYears(year) === false &&
      month === 2 &&
      date > 28
    ) {
      el.setCustomValidity('วันที่ไม่ถูกต้อง');
      el.classList.add('is-invalid');

      if (feedback) {
        feedback.textContent = 'วันที่ไม่ถูกต้อง เนื่องจากไม่ใช่ปีอธิกสุรทิน';
      }

      return false;
    }

    // ตรวจสอบ pattern ของ input
    if (!el.checkValidity()) {
      el.classList.add('is-invalid');

      if (feedback) {
        feedback.textContent = defaultMessage;
      }

      return false;
    }
  }

  // ตรวจช่วงวันที่เมื่อเลือกครบทั้งสองช่อง
  if (dateInput1.value !== '' && dateInput2.value !== '') {
    const dateVal1 = new Date(convertDateStr(dateInput1.value));
    const dateVal2 = new Date(convertDateStr(dateInput2.value));

    if (dateVal2 < dateVal1) {
      dateInput2.setCustomValidity(
        'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น'
      );

      dateInput2.classList.add('is-invalid');

      $('#date2-feedback').text(
        'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น'
      );

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'โปรดเลือกช่วงวันที่ให้ถูกต้อง!',
        timer: 3000
      });

      return false;
    }
  }

  return true;
}

function validateSurgApointTableForm(){
   const form = document.getElementById("surgTable")
    
    const isValid = form.checkValidity();

    form.classList.add('was-validated');

    return isValid;

}
  
  function validateDateHoliday(){
     const inputDate = document.querySelectorAll("#date")
      Array.prototype.slice.call(inputDate).forEach(function (el) {
        let year = el.value.split('/')[2]
        let month = el.value.split('/')[1]
        let date = el.value.split('/')[0]
        let strDate = year+"/"+month+"/"+date
        let dateVal = new Date(strDate)
        let initDaysBefore = new Date(addDayToCurrentDate(1));
        let endDaysBefore = new Date(addDayToCurrentDate(90));

        if(checkLeapYears(year) === false && Number(month) == 2 && Number(date) > 28 ){             
          el.setCustomValidity("Invalid date! Not a leap year and date value exceeds 28.");          
          return false;
        }
        else if(dateVal.getDay() == 0 && dateVal.getDay() == 6){
          el.setCustomValidity("Invalid date! is sun or sat."); 
          //console.log('tue thu',dateVal.getDay())         
          return false;
        }
        else if(gHolidays.includes(el.value)){
          el.setCustomValidity("Invalid date! include holiday."); 
          //console.log('disday')          
          return false;
        }        
        else {
          el.setCustomValidity("");
        }
        return el.checkValidity();       
      }) 
  }
 
  function validateDateLeapYear(){ //for add record
      const date = $('#date').val() 
      let strResult = ''     
      if(date !== '' && !gDisabledDaysArray.includes(date)){
        const findQ = gEmptyQ.find(r=>r[0]===date)
        const remain = typeof(findQ) == 'undefined' ? 0 : findQ[1]
        strResult = "นัดได้อีก " + (gMaxPerDay - remain) + " คน"        
        $('#showRemain').html(strResult)
      }
      else if(gDisabledDaysArray.includes(date)){
        strResult = "นัดได้อีก 0 คน"       
        $('#showRemain').html(strResult)
      }
      else{
        $('#showRemain').html('')
        strResult = ''
      }
      
      const inputDate = document.querySelectorAll("#date")
      Array.prototype.slice.call(inputDate).forEach(function (el) {
        let year = el.value.split('/')[2]
        let month = el.value.split('/')[1]
        let date = el.value.split('/')[0]
        let strDate = year+"/"+month+"/"+date
        let dateVal = new Date(strDate)
        let initDaysBefore = new Date(addDayToCurrentDate(1));
        let endDaysBefore = new Date(addDayToCurrentDate(90));

        if(checkLeapYears(year) === false && Number(month) == 2 && Number(date) > 28 ){             
          el.setCustomValidity("Invalid date! Not a leap year and date value exceeds 28.");          
          return false;
        }
        else if(dateVal.getDay() !== 1 && dateVal.getDay() !== 3 && dateVal.getDay() !== 4){
          el.setCustomValidity("Invalid date! Not mon wed thu"); 
                 
          return false;
        }        
        else if(gDisabledDaysArray.includes(el.value)){
          el.setCustomValidity("Invalid date! include disabled day."); 
          //console.log('disday')          
          return false;
        }
        else if(dateVal < initDaysBefore || dateVal > endDaysBefore){
          el.setCustomValidity("Invalid date! choose date 1 day before and less than 90 day.");   
          Swal.fire({
                     position: 'center',
                     icon: 'error',
                     title: 'โปรดนัดล่วงหน้าอย่างน้อย 1 วัน และไม่เกิน 90 วัน!' ,
                     timer: 3000

                  }) 
          //console.log('day before')                    
          return false;
        }
        else {
          el.setCustomValidity("");
        }
        return el.checkValidity();       
      }) 
          
  }

  function validateDateForEdit(){
      const date = $('#date').val() 
      let strResult = ''     
      if(date !== '' && !gDisabledDaysArray.includes(date)){
        const findQ = gEmptyQ.find(r=>r[0]===date)
        const remain = typeof(findQ) == 'undefined' ? 0 : findQ[1]
        strResult = "นัดได้อีก " + (gMaxPerDay - remain) + " คน"        
        $('#showRemain').html(strResult)
      }
      else if(gDisabledDaysArray.includes(date)){
        strResult = "นัดได้อีก 0 คน"       
        $('#showRemain').html(strResult)
      }
      else{
        $('#showRemain').html('')
        strResult = ''
      }
      
      const inputDate = document.querySelectorAll("#date")
      Array.prototype.slice.call(inputDate).forEach(function (el){
        let year = el.value.split('/')[2]
        let month = el.value.split('/')[1]
        let date = el.value.split('/')[0]
        let strDate = year+"/"+month+"/"+date
        let dateVal = new Date(strDate)
        let initDaysBefore = new Date(addDayToCurrentDate(1));
        let endDaysBefore = new Date(addDayToCurrentDate(90));

        // on edit not check gDisabledDaysArray if date not change 

        if(checkLeapYears(year) === false && Number(month) == 2 && Number(date) > 28 ){             
          el.setCustomValidity("Invalid date! Not a leap year and date value exceeds 28.");          
          return false;
        }
        else if(dateVal.getDay() !== 1 && dateVal.getDay() !== 3 && dateVal.getDay() !== 4){
          el.setCustomValidity("Invalid date! Not mon wed thu"); 
                 
          return false;
        }          
        else if(dateVal < initDaysBefore || dateVal > endDaysBefore){
          el.setCustomValidity("Invalid date! choose date 1 day before and less than 90 day.");   
          Swal.fire({
                     position: 'center',
                     icon: 'error',
                     title: 'โปรดนัดล่วงหน้าอย่างน้อย 1 วัน และไม่เกิน 90 วัน!' ,
                     timer: 3000

                  }) 
          //console.log('day before')                    
          return false;
        }
        else {
          el.setCustomValidity("");
        }
        return el.checkValidity();       
      }) 
          
  }  


//----------------------------------- Validate Func -----------------------------------------------//
//----------------------------------- Validate Func -----------------------------------------------//


//--------------------- API Login Add Reccord  --------------------------------------------------------//
//--------------------- API Login Add Reccord --------------------------------------------------------//
async function api(url, options = {}) {

    const response = await fetch(url, options);

    if (!response.ok) {

        throw new Error(
            `${response.status} ${response.statusText}`
        );

    }

    return await response.json();

}


//----------------------------- Global variable config ---------------------------------------------------------

let gUser_data, gUser_name, gUser_pass, gUserRealName, gUserId, gUserLevel;
let gDisabledDaysArray = [];
let gEmptyQ, gNameArr, gTelArr, gHolidays, gHolidaysAll, gFirstDate;
let gName, gHN, gTel, gAddRecObj;
let gIsLoggedIn = false;
let gSearchObjMain, gSearchData, gCupData, gInitDate, gEditDataId, gOriginHosp;

const gEnableDayOfWeek = [1, 3 , 4]
const gMaxPerDay = 10;


//----------------------------- Global variable config ---------------------------------------------------------
function populateDates(disabledDays, firstDate) {
  const disabledDateSet = new Set(
    (disabledDays || []).map(dateText =>
      new Date(convertDateStr(dateText)).toDateString()
    )
  );

  const $date = $('#date');

  if (!$date.length) {
    console.error('populateDates: ไม่พบ element #date');
    loadingEnd();
    return;
  }

  const datepickerOptions = {
    minDate: new Date(firstDate),
    maxDate: 90,
    dateFormat: 'dd/mm/yy',

    dayNamesMin: [
      'อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'
    ],

    monthNames: [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ],

    beforeShowDay: function(date) {
      const dayOfWeek = date.getDay();

      const disabled =
        disabledDateSet.has(date.toDateString()) || !gEnableDayOfWeek.includes(dayOfWeek);
        

      return [!disabled];
    }
  };

  if ($date.hasClass('hasDatepicker')) {
    // อัปเดต Instance เดิม
    $date.datepicker('option', datepickerOptions);
    $date.datepicker('refresh');

  } else {
    // สร้างครั้งแรก
    $date.datepicker(datepickerOptions);
  }

  loadingEnd();
}


function populateNames(names){         
   
      
      $('#name').autocomplete({
        source: names
      });
    
}  

function populateTels(tels){    
   
      
      $("#tel").autocomplete({
        source: tels
      });
    
}


async function handleLogin(event) {
    event.preventDefault();

    const id = getTokenFromUrl();

    if (!id) {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ข้อมูล web ไม่ถูกต้อง',
            text: 'ไม่พบข้อมูล web id',
            showConfirmButton: true,
            timer: 2500
        });

        return;
    }

    if (!validateLogin()) {
        return;
    }

    const btn = document.getElementById('login_btn');
    const btnText = document.getElementById('login_btn_text');
    const spinner = document.getElementById('resp-spinnerA');

    btn.disabled = true;
    btnText.textContent = 'กำลัง Login...';
    spinner.classList.remove('d-none');

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const payload = {
            id: id,
            username: username,
            password: password
        };

        const fd = new FormData();

        fd.append('action', 'login');
        fd.append('data', JSON.stringify(payload));

        const res = await api(mainUrl, {
            method: 'POST',
            redirect: 'follow',
            mode: 'cors',
            body: fd
        });

        // console.log('login response:', res);

        if (!res) {
            throw new Error('ไม่พบข้อมูลตอบกลับจากระบบ Login');
        }

        if(res.status === 'token_error'){
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล web id ไม่ถูกต้อง',
                text: res.message || 'โปรดตรวจสอบ web link',
                showConfirmButton: true,
                timer: 2500
            });
            return

        }

        const userData = Array.isArray(res.user_data) ? res.user_data : [];

        const loginOK =  res.status === 'success' && userData.length > 0;

        if (!loginOK) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูลผู้ใช้งานไม่ถูกต้อง',
                text: res.message || 'โปรดตรวจสอบ username/password',
                showConfirmButton: true,
                timer: 2500
            });

            document.getElementById('username').value = '';
            document.getElementById('password').value = '';

            const form = document.getElementById('loginform');
            form.classList.remove('was-validated');

            document.getElementById('username').focus();

            return;
        }

        gUser_data = userData;
        gUserId = gUser_data[0];
        gUser_name = gUser_data[1];
        gUserRealName = gUser_data[3];
        gUserLevel = gUser_data[4];
        gUser_pass = password

        gNameArr = Array.isArray(res.uniqueNameArr) ? res.uniqueNameArr : [];

        gTelArr = Array.isArray(res.uniqueTelArr) ? res.uniqueTelArr : [];

        gDisabledDaysArray = Array.isArray(res.disabledDays) ? res.disabledDays : [];

        gFirstDate = res.firstDate || ''

        gEmptyQ = res.emptyQ;
        gHolidays = res.holidays;
        gIsLoggedIn = true;

        populateNames(gNameArr);
        populateTels(gTelArr);
        populateDates(res.disabledDays, res.firstDate);
        letGoTrim();

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Login สำเร็จ',
            text: res.message || 'Login สำเร็จ',
            showConfirmButton: true,
            timer: 2500
        });

        $('#navbarDropdown').html(gUserRealName);
        $('#login').hide();
        $('#user-content').show();

    } catch (err) {
        console.error('handleLogin error:', err);

        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ส่งข้อมูล Login ไม่สำเร็จ',
            text: err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล',
            showConfirmButton: true
        });

    } finally {
        btn.disabled = false;
        btnText.textContent = 'Login';
        spinner.classList.add('d-none');
    }
}


function clickLogout() {
    gIsLoggedIn = false;

    gUser_data = null;
    gUser_name = "";
    gUserRealName = "";
    gUserId = "";
    gUserLevel = "";
    gUser_pass = "";

    gNameArr = [];
    gTelArr = [];
    gEmptyQ = [];
    gHolidays = [];

    $("#navbarDropdown").html("");
    $("#app").html("");
    $("#user-content").hide();
    $("#login").show();

    const loginForm = document.getElementById("loginform");

    if (loginForm) {
        loginForm.reset();
        loginForm.classList.remove("was-validated");
    }

    document.getElementById("username")?.focus();
    initializeApp()
}



async function addRecord(event) {
    event.preventDefault();

    if (!validateAddForm()) {
        return;
    }

    const btn = document.getElementById('btn1');

    if (!btn) {
        console.error('addRecord: ไม่พบปุ่ม #btn1');
        return;
    }

    btn.disabled = true;
    showSpin3();

    try {
        const hn = document.getElementById('hn').value.trim();
        const name = document.getElementById('name').value.trim();
        const tel = document.getElementById('tel').value.trim();
        const date = document.getElementById('date').value.trim();
        const webId = getTokenFromUrl();

        if (!webId) {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล web ไม่ถูกต้อง',
                text: 'ไม่พบข้อมูล web id',
                showConfirmButton: true,
                timer: 2500
            });

            return;
        }

        gName = name;
        gHN = hn;
        gTel = tel;

        gAddRecObj = {
            id: webId,
            name: name,
            hn: hn,
            tel: tel,
            upDate: date,
            username: gUser_name,
            userId: gUserId,
            userRealName: gUserRealName
        };

        const fd = new FormData();

        fd.append('action', 'addRecord');
        fd.append('data', JSON.stringify(gAddRecObj));

        const res = await api(mainUrl, {
            method: 'POST',
            redirect: 'follow',
            mode: 'cors',
            body: fd
        });

        // console.log('add record response:', res);

        if (!res) {
            throw new Error('ไม่พบข้อมูลตอบกลับจากการบันทึกข้อมูล');
        }

        if (res.status === 'token_error') {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล web id ไม่ถูกต้อง',
                text: res.message || 'โปรดตรวจสอบ web link',
                showConfirmButton: true,
                timer: 2500
            });

            return;
        }

        if (res.reason === 'found_fullQ_date') {
            gEmptyQ = res.emptyQ || [];

            populateDates(
                res.disabledDays || [],
                res.firstDate
            );

            await Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'คิวนัดเต็ม!',
                text: 'กรุณาเลือกวันนัดใหม่',
                showConfirmButton: true,
                timer: 2000
            });

            document.getElementById('date').value = '';
            document.getElementById('date').focus();

            return;
        }

        const addRecordOK = res.status === 'success' && res.message === 'add_success';

        if (!addRecordOK) {
            throw new Error(
                res.message || 'ระบบไม่สามารถบันทึกข้อมูลได้'
            );
        }

        /*
         * เก็บข้อมูลล่าสุดจาก API
         */
        gEmptyQ = res.emptyQ || [];

        populateDates(
            res.disabledDays || [],
            res.firstDate
        );

        const htmlStr = `
            <div class="container">
                <div class="row my-2">
                    <div class="col">
                        <p>พิมพ์ใบนัด ${escapeHtml(gAddRecObj.name)}</p>

                        <button
                            type="button"
                            class="btn btn-success"
                            onclick="printAddRec()"
                        >
                            พิมพ์
                        </button>
                    </div>
                </div>
            </div>
        `;

        await Swal.fire({
            position: 'center',
            title: 'บันทึกสำเร็จ!',
            icon: 'success',
            html: htmlStr,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ปิดหน้าต่าง',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });

        const form = document.getElementById('addSurgForm');

        if (form) {
            form.reset();
            form.classList.remove('was-validated');
        }

        document.getElementById('hn')?.focus();
        $('#showRemain').html('')

    } catch (error) {
        console.error('addRecord error:', error);

        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'บันทึกข้อมูลไม่สำเร็จ',
            text: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
            showConfirmButton: true
        });

    } finally {
        btn.disabled = false;
        hideSpin3();
    }
}

function printAddRec() {
  const name = gAddRecObj.name
  const hn = gAddRecObj.hn === '' ? '-' : gAddRecObj.hn
  const tel = gAddRecObj.tel === '000-0000000' ? '-' : gAddRecObj.tel;
  const date = gAddRecObj.upDate 
  const hosp = gAddRecObj.userRealName
  const dateVal = new Date(convertDateStr(date))
  const dayOfWeek = thaiDay(dateVal.getDay())
  const monthTh = thaiMonth(dateVal.getMonth())
  const yyyy = dateVal.getFullYear() + 543 
  const d = dateVal.getDate()

  const logoUrl = getAssetUrl(
    'public/pic/ck_logo.jpg'
  );

  const logoRtUrl = getAssetUrl(
    'public/pic/orthopedic.png'
  );

  const fontRegularUrl = getAssetUrl(
    'public/fonts/Sarabun-Regular.ttf'
  );

  const fontBoldUrl = getAssetUrl(
    'public/fonts/Sarabun-Bold.ttf'
  );

  const html = `
    <!doctype html>
    <html lang="th">
      <head>
        <meta charset="utf-8">

        <title>ใบนัดตรวจรักษา</title>

        <style>
          @font-face {
            font-family: "Sarabun";
            src: url("${fontRegularUrl}") format("truetype");
            font-weight: 400;
            font-style: normal;
          }

          @font-face {
            font-family: "Sarabun";
            src: url("${fontBoldUrl}") format("truetype");
            font-weight: 700;
            font-style: normal;
          }

          @page {
            size: A4 portrait;
            margin: 14mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            color: #111827;
            background: #ffffff;
            font-family: "Sarabun", sans-serif;
            font-size: 15px;
            line-height: 1.5;
          }

          .appointment-sheet {
            width: 100%;
            max-width: 180mm;
            margin: 0 auto;
            overflow: hidden;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
          }

          .header {
            display: grid;
            grid-template-columns: 90px minmax(0, 1fr) 90px;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 2px solid #7e22ce;
          }

          .hospital-logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
          }

          .hospital-logo-left {
            justify-self: start;
          }

          .hospital-logo-right {
            justify-self: end;
          }

          .header-text {
            min-width: 0;
            text-align: center;
          }

          .document-title {
            margin: 0 0 4px;
            color: #6b21a8;
            font-size: 21px;
            font-weight: 700;
          }

          .hospital-name {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .content {
            padding: 20px;
          }

          .appointment-date {
            margin-bottom: 18px;
            padding: 12px 16px;
            text-align: center;
            background: #faf5ff;
            border: 1px solid #d8b4fe;
            border-radius: 7px;
          }

          .appointment-label {
            margin-bottom: 3px;
            color: #6b21a8;
            font-size: 14px;
            font-weight: 600;
          }

          .appointment-value {
            color: #111827;
            font-size: 20px;
            font-weight: 700;
          }

          .section-title {
            margin: 0 0 8px;
            padding-bottom: 5px;
            color: #6b21a8;
            font-size: 16px;
            font-weight: 700;
            border-bottom: 1px solid #e5e7eb;
          }

          .info-table {
            width: 100%;
            margin-bottom: 18px;
            border-collapse: collapse;
          }

          .info-table td {
            padding: 6px 8px;
            vertical-align: top;
            border-bottom: 1px solid #f1f5f9;
          }

          .info-table .label {
            width: 105px;
            color: #374151;
            font-weight: 700;
          }

          .info-table .value {
            color: #111827;
          }

          .notice {
            padding: 12px 15px;
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            border-radius: 4px;
          }

          .notice-title {
            margin: 0 0 4px;
            font-weight: 700;
          }

          .notice-text {
            margin: 0;
          }

          .footer {
            padding: 12px 20px;
            color: #374151;
            text-align: center;
            border-top: 1px solid #cbd5e1;
            font-size: 13px;
          }

          .footer p {
            margin: 2px 0;
          }

          @media print {
            html,
            body {
              width: 210mm;
              min-height: 297mm;
            }

            .appointment-sheet {
              border-color: #94a3b8;
              break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        <main class="appointment-sheet">

          <header class="header">
            <img
              src="${logoUrl}"
              class="hospital-logo hospital-logo-left"
              alt="ตราโรงพยาบาล"
            >

            <div class="header-text">
              <h1 class="document-title">
                ใบนัดตรวจรักษาแผนกศัลยกรรมกระดูก
              </h1>

              <p class="hospital-name">
                โรงพยาบาลสมเด็จพระยุพราชเชียงของ
              </p>
            </div>

            <img
              src="${logoRtUrl}"
              class="hospital-logo hospital-logo-right"
              alt="ตราแผนกศัลยกรรมกระดูก"
            >
          </header>

          <section class="content">

            <div class="appointment-date">
              <div class="appointment-label">
                วันนัดตรวจรักษา
              </div>

              <div class="appointment-value">
                วัน${dayOfWeek} ที่ ${d} ${monthTh} ${yyyy}
              </div>
            </div>

            <h2 class="section-title">
              ข้อมูลผู้รับบริการ
            </h2>

            <table class="info-table">
              <tbody>
                <tr>
                  <td class="label">ชื่อ-สกุล</td>
                  <td class="value">${name}</td>
                </tr>

                <tr>
                  <td class="label">HN</td>
                  <td class="value">${hn}</td>
                </tr>

                <tr>
                  <td class="label">โทรศัพท์</td>
                  <td class="value">${tel}</td>
                </tr>

                <tr>
                  <td class="label">ผู้นัด</td>
                  <td class="value">${hosp}</td>
                </tr>
              </tbody>
            </table>

            <div class="notice">
              <p class="notice-title">
                ข้อแนะนำ
              </p>

              <p class="notice-text">
                โปรดนำใบนัดมาติดต่อที่อาคารผู้ป่วยนอก
                ในช่วงเวลา 08.00 น. – 10.00 น.
              </p>
            </div>

          </section>

          <footer class="footer">
            <p>
              แผนกศัลยกรรมกระดูก โทร (053) 791206 ต่อ 610
            </p>

            <p>
              โทรศัพท์มือถือ 095-2389220
            </p>
          </footer>

        </main>
      </body>
    </html>
  `;

  const printWin = window.open(
    '',
    '',
    'left=50,top=50,width=800,height=700,toolbar=0,scrollbars=1,status=0'
  );

  if (!printWin) {
    Swal.fire({
      icon: 'warning',
      title: 'ไม่สามารถเปิดหน้าพิมพ์ได้',
      text: 'โปรดอนุญาต Popup สำหรับเว็บไซต์นี้'
    });

    return;
  }

  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();

  // รอโลโก้ทั้งสองภาพโหลดเสร็จ
  const imagePromises = Array
    .from(printWin.document.images)
    .map(img => {
      if (img.complete) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

  // รอฟอนต์ Sarabun โหลดเสร็จ
  const fontPromise = printWin.document.fonts
    ? printWin.document.fonts.ready
    : Promise.resolve();

  Promise.all([
    fontPromise,
    ...imagePromises
  ]).then(() => {
    printWin.focus();
    printWin.print();

    setTimeout(() => {
      printWin.close();
    }, 500);
  });
}





//--------------------- API Login Add Reccord  --------------------------------------------------------//
//--------------------- API Login Add Reccord --------------------------------------------------------//


//-------------------------- Search for Edit and print ------------------------------------------------------

function search(){
         const searchInput =  document.getElementById("searchInput").value.toString().toLowerCase().trim();
         let searchWords = searchInput.split(/\s+/);
         const searchColumns =[2];
         
         let resultsArray = searchInput === "" ? [] :gSearchData.filter(function(r){  //search from global var name is gSearchData
             return searchWords.every(function(word){
              return searchColumns.some(function(colIndex){
                 return r[colIndex].toString().toLowerCase().indexOf(word) !== -1               
               
               });             
             });
           });
           
        let searchResultBox = document.getElementById("searchResults");
        let templateBox = document.getElementById("rowTemplate"); 
        let template = templateBox.content;
        
        searchResultBox.innerHTML="";
        
        resultsArray.forEach(function(r){
        
          let tr = template.cloneNode(true);         
          let nameColumn = tr.querySelector(".name");
          let hnColumn = tr.querySelector(".hn");         
          let dateColumn = tr.querySelector(".date"); 
          let userColumn = tr.querySelector(".user");   
          let printButton = tr.querySelector(".print-button");      
          let deleteButton = tr.querySelector(".delete-button");
          let editButton = tr.querySelector(".edit-button");          
          
          printButton.dataset.id = r[0];
          deleteButton.dataset.id = r[0];
          editButton.dataset.id = r[0];
          nameColumn.textContent= r[2];
          hnColumn.textContent= r[1];         
          dateColumn.textContent= r[4];
          userColumn.textContent= r[7];
          searchResultBox.appendChild(tr);
        });
  }


function printData(e) {
  const id = e.target.dataset.id;
  const indx = gCupData.findIndex(r => r[0] === id);

  if (indx === -1) {
    Swal.fire({
      icon: 'error',
      title: 'ไม่พบข้อมูลที่ต้องการพิมพ์'
    });
    return;
  }

  const hn = gCupData[indx][1] === '' ? '-' : gCupData[indx][1];
  const name = gCupData[indx][2];
  const tel = gCupData[indx][3] === '000-0000000' ? '-' : gCupData[indx][3];
  const date = gCupData[indx][4];
  const hosp = gCupData[indx][7] || '-';

  const dateVal = new Date(convertDateStr(date));
  const dayOfWeek = thaiDay(dateVal.getDay());
  const monthTh = thaiMonth(dateVal.getMonth());
  const yyyy = dateVal.getFullYear() + 543;
  const d = dateVal.getDate();

  const logoUrl = getAssetUrl(
    'public/pic/ck_logo.jpg'
  );

  const logoRtUrl = getAssetUrl(
    'public/pic/orthopedic.png'
  );

  const fontRegularUrl = getAssetUrl(
    'public/fonts/Sarabun-Regular.ttf'
  );

  const fontBoldUrl = getAssetUrl(
    'public/fonts/Sarabun-Bold.ttf'
  );

  const html = `
    <!doctype html>
    <html lang="th">
      <head>
        <meta charset="utf-8">
        <title>ใบนัดตรวจรักษา</title>

        <style>
          @font-face {
            font-family: "Sarabun";
            src: url("${fontRegularUrl}") format("truetype");
            font-weight: 400;
            font-style: normal;
          }

          @font-face {
            font-family: "Sarabun";
            src: url("${fontBoldUrl}") format("truetype");
            font-weight: 700;
            font-style: normal;
          }

          @page {
            size: A4 portrait;
            margin: 14mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #111827;
            font-family: "Sarabun", sans-serif;
            font-size: 15px;
            line-height: 1.5;
          }

          .appointment-sheet {
            width: 100%;
            max-width: 180mm;
            margin: 0 auto;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            overflow: hidden;
          }

          .header {
            display: grid;
            grid-template-columns: 90px minmax(0, 1fr) 90px;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 2px solid #7e22ce;
          }

          .hospital-logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
          }

          .hospital-logo-left {
            justify-self: start;
          }

          .hospital-logo-right {
            justify-self: end;
          }

          .header-text {
            min-width: 0;
            text-align: center;
          }

          .document-title {
            margin: 0 0 4px;
            color: #6b21a8;
            font-size: 21px;
            font-weight: 700;
          }

          .hospital-name {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .content {
            padding: 20px;
          }

          .appointment-date {
            margin-bottom: 18px;
            padding: 12px 16px;
            text-align: center;
            background: #faf5ff;
            border: 1px solid #d8b4fe;
            border-radius: 7px;
          }

          .appointment-label {
            margin-bottom: 3px;
            color: #6b21a8;
            font-size: 14px;
            font-weight: 600;
          }

          .appointment-value {
            color: #111827;
            font-size: 20px;
            font-weight: 700;
          }

          .section-title {
            margin: 0 0 8px;
            padding-bottom: 5px;
            color: #6b21a8;
            font-size: 16px;
            font-weight: 700;
            border-bottom: 1px solid #e5e7eb;
          }

          .info-table {
            width: 100%;
            margin-bottom: 18px;
            border-collapse: collapse;
          }

          .info-table td {
            padding: 6px 8px;
            vertical-align: top;
            border-bottom: 1px solid #f1f5f9;
          }

          .info-table .label {
            width: 105px;
            color: #374151;
            font-weight: 700;
          }

          .info-table .value {
            color: #111827;
          }

          .notice {
            padding: 12px 15px;
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            border-radius: 4px;
          }

          .notice-title {
            margin: 0 0 4px;
            font-weight: 700;
          }

          .notice-text {
            margin: 0;
          }

          .footer {
            padding: 12px 20px;
            color: #374151;
            text-align: center;
            border-top: 1px solid #cbd5e1;
            font-size: 13px;
          }

          .footer p {
            margin: 2px 0;
          }

          @media print {
            html,
            body {
              width: 210mm;
              min-height: 297mm;
            }

            .appointment-sheet {
              border-color: #94a3b8;
              break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        <main class="appointment-sheet">

          <header class="header">
            <img
              src="${logoUrl}"
              class="hospital-logo hospital-logo-left"
              alt="ตราโรงพยาบาล"
            >

            <div class="header-text">
              <h1 class="document-title">
                ใบนัดตรวจรักษาแผนกศัลยกรรมกระดูก
              </h1>

              <p class="hospital-name">
                โรงพยาบาลสมเด็จพระยุพราชเชียงของ
              </p>
            </div>

            <img
              src="${logoRtUrl}"
              class="hospital-logo hospital-logo-right"
              alt="ตราแผนกศัลยกรรมกระดูก"
            >
          </header>

          <section class="content">

            <div class="appointment-date">
              <div class="appointment-label">วันนัดตรวจรักษา</div>

              <div class="appointment-value">
                วัน${dayOfWeek} ที่ ${d} ${monthTh} ${yyyy}
              </div>
            </div>

            <h2 class="section-title">ข้อมูลผู้รับบริการ</h2>

            <table class="info-table">
              <tbody>
                <tr>
                  <td class="label">ชื่อ-สกุล</td>
                  <td class="value">${name}</td>
                </tr>

                <tr>
                  <td class="label">HN</td>
                  <td class="value">${hn}</td>
                </tr>

                <tr>
                  <td class="label">โทรศัพท์</td>
                  <td class="value">${tel}</td>
                </tr>

                <tr>
                  <td class="label">ผู้นัด</td>
                  <td class="value">${hosp}</td>
                </tr>
              </tbody>
            </table>

            <div class="notice">
              <p class="notice-title">ข้อแนะนำ</p>

              <p class="notice-text">
                โปรดนำใบนัดมาติดต่อที่อาคารผู้ป่วยนอก
                ในช่วงเวลา 08.00 น. – 10.00 น.
              </p>
            </div>

          </section>

          <footer class="footer">
            <p>
              แผนกศัลยกรรมกระดูก โทร (053) 791206 ต่อ 610
            </p>

            <p>
              โทรศัพท์มือถือ 095-2389220
            </p>
          </footer>

        </main>
      </body>
    </html>
  `;

  const printWin = window.open(
    '',
    '',
    'left=50,top=50,width=800,height=700,toolbar=0,scrollbars=1,status=0'
  );

  if (!printWin) {
    Swal.fire({
      icon: 'warning',
      title: 'ไม่สามารถเปิดหน้าพิมพ์ได้',
      text: 'โปรดอนุญาต Popup สำหรับเว็บไซต์นี้'
    });
    return;
  }

  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();

  // รอรูปภาพและฟอนต์โหลดเสร็จก่อนพิมพ์
  const imagePromises = Array.from(printWin.document.images).map(img => {
    if (img.complete) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  const fontPromise = printWin.document.fonts
    ? printWin.document.fonts.ready
    : Promise.resolve();

  Promise.all([
    fontPromise,
    ...imagePromises
  ]).then(() => {
    printWin.focus();
    printWin.print();

    // รอให้หน้าต่าง Print dialog รับข้อมูลก่อนปิด
    setTimeout(() => {
      printWin.close();
    }, 500);
  });
}

//-------------------------- Search for Edit and print ------------------------------------------------------



//-------------------------- Edit Pt Record -----------------------------------------------------------------
function afterEditViewLoads(e) {
    e.preventDefault();

    const data_id = e.target.dataset.id;

    const record = gSearchData.find(
        row => String(row[0]) === String(data_id)
    );

    if (!record) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "ไม่พบข้อมูลผู้ป่วย",
            text: "ข้อมูลอาจถูกลบหรือมีการเปลี่ยนแปลงแล้ว",
            confirmButtonText: "ตกลง"
        });

        return;
    }

    const hn = record[1] || "";
    const name = record[2] || "";
    const tel = record[3] || "";
    const date = record[4] || "";

    $("#data_id").val(data_id);
    $("#hn").val(hn);
    $("#name").val(name);
    $("#tel").val(tel);
    $("#date").val(date);

    gInitDate = date;
    gOriginHosp = record[7] || "";

    // populateDates(gDisabledDaysArray, gFirstDate);

    $("#search_el").hide();
    $("#addSurgForm").show();
}

function showSearchEl(){
   $("#search_el").show();
   $("#addSurgForm").hide();   
   $("#searchInput").val('')
   $("#searchResults").html('')
   const form = document.getElementById('addSurgForm');

        if (form) {
            form.reset();
            form.classList.remove('was-validated');
        }

        
    $('#showRemain').html('')

    gInitDate = '';
    gOriginHosp = '';
}

async function editData(event){
    event.preventDefault()
    if (!validateAddForm()) {
        return;
    }

    const btn1 = document.getElementById('btn1');

    if (!btn1) {
        console.error('editRecord: ไม่พบปุ่ม #btn1');
        return;
    }

    const btn2 = document.getElementById('btn2');

    if (!btn2) {
        console.error('editRecord: ไม่พบปุ่ม #btn2');
        return;
    }

    btn1.disabled = true;
    btn2.disabled = true;
    showSpin3();

    try {
        
        const data_id = $('#data_id').val()
        const name = $('#name').val()
        const hn = $('#hn').val()
        const tel = $('#tel').val()
        const date = $('#date').val()  
        const webId = getTokenFromUrl();        

        if (!webId) {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล web ไม่ถูกต้อง',
                text: 'ไม่พบข้อมูล web id',
                showConfirmButton: true,
                timer: 2500
            });

            return;
        }
        gAddRecObj  = {
          id:webId,
          data_id:data_id,
          name:name,
          hn:hn,
          tel:tel,
          upDate:date,
          oldDate:gInitDate,
          username:gUser_name,
          userId:gUserId,
          userRealName:gOriginHosp,

        }
        gEditDataId = data_id

        const fd = new FormData();

        fd.append('action', 'editRecord');
        fd.append('data', JSON.stringify(gAddRecObj));

        const res = await api(mainUrl, {
            method: 'POST',
            redirect: 'follow',
            mode: 'cors',
            body: fd
        });

        // console.log('edit record response:', res);

        if (!res) {
            throw new Error('ไม่พบข้อมูลตอบกลับจากการแก้ไขข้อมูล');
        }

        if (res.status === 'token_error') {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล web id ไม่ถูกต้อง',
                text: res.message || 'โปรดตรวจสอบ web link',
                showConfirmButton: true,
                timer: 2500
            });

            return;
        }

        if (res.reason === 'edit_found_fullQ_date') {
            gEmptyQ = res.emptyQ;

            populateDates(res.disabledDays,res.firstDate);

            await Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'คิวนัดเต็ม!',
                text: 'กรุณาเลือกวันนัดใหม่',
                showConfirmButton: true,
                timer: 2000
            });

            document.getElementById('date').value = '';
            document.getElementById('date').focus();

            return;
        }

        const editRecordOK = res.status === 'success' && res.message === 'edit_success';

        if (!editRecordOK) {
            throw new Error(
                res.message || 'ระบบไม่สามารถแก้ไขข้อมูลได้'
            );
        }

        updateEditedRecordInAllArrays(gAddRecObj);

        showSearchEl()

        const htmlStr = `
            <div class="container">
                <div class="row my-2">
                    <div class="col">
                        <p>พิมพ์ใบนัด ${escapeHtml(gAddRecObj.name)}</p>

                        <button
                            type="button"
                            class="btn btn-success"
                            onclick="printAddRec()"
                        >
                            พิมพ์
                        </button>
                    </div>
                </div>
            </div>
        `;

        await Swal.fire({
            position: 'center',
            title: 'แก้ไขสำเร็จ!',
            icon: 'success',
            html: htmlStr,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ปิดหน้าต่าง',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });        

      
    } catch (error) {
       console.error('editRecord error:', error);

        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'แก้ข้อมูลไม่สำเร็จ',
            text: error.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
            showConfirmButton: true
        });

    }finally{
      btn1.disabled = false;
      btn2.disabled = false;
      hideSpin3();      
    }
    
}

function dateToTimestamp(dateText) {
    if (!dateText) {
        return Number.MAX_SAFE_INTEGER;
    }

    const [day, month, year] = dateText
        .split("/")
        .map(Number);

    if (!day || !month || !year) {
        return Number.MAX_SAFE_INTEGER;
    }

    return new Date(
        year,
        month - 1,
        day
    ).getTime();
}


function updateEditedRecord(array, editedData) {
    if (!Array.isArray(array)) {
        return;
    }

    const record = array.find(
        row =>
            String(row[0]) ===
            String(editedData.data_id)
    );

    if (!record) {
        return;
    }

    // แก้เฉพาะ column ที่กำหนด
    record[1] = editedData.hn;
    record[2] = editedData.name;
    record[3] = editedData.tel;
    record[4] = editedData.upDate;

    // เรียงวันที่จากเก่าไปใหม่
    array.sort(
        (a, b) =>
            dateToTimestamp(a[4]) -
            dateToTimestamp(b[4])
    );
}


function updateEditedRecordInAllArrays(editedData) {
    updateEditedRecord(gSearchData, editedData);
    updateEditedRecord(gCupData, editedData);
    updateEditedRecord(gSearchObjMain, editedData);
}


//-------------------------- Edit Pt Record -----------------------------------------------------------------



//-------------------------- Delete Pt Record ----------------------------------------------------------------

async function deleteData(e) {
    e.preventDefault();

    const button = e.target;
    const webId = getTokenFromUrl();       // Web token
    const dataId = button.dataset.id;      // ID ของข้อมูลผู้ป่วย
    const userId = gUserId;

    // ตรวจสอบ Web token
    if (!webId) {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ข้อมูล Web ไม่ถูกต้อง',
            text: 'ไม่พบข้อมูล Web ID',
            confirmButtonText: 'ตกลง'
        });

        return;
    }

    // ตรวจสอบ data ID
    if (!dataId) {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ไม่พบรหัสข้อมูลผู้ป่วย',
            confirmButtonText: 'ตกลง'
        });

        return;
    }

    // หา record จาก data_id ไม่ใช่ webId
    const record = gSearchData.find(
        row => String(row[0]) === String(dataId)
    );

    if (!record) {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ไม่พบข้อมูลผู้ป่วย',
            text: 'ข้อมูลอาจถูกลบหรือมีการเปลี่ยนแปลงแล้ว',
            confirmButtonText: 'ตกลง'
        });

        return;
    }

    const patientName = record[2] || '';
    const resultBox = button.closest('.result-box');

    // เปิดกล่องยืนยันและรับรหัสผ่าน
    const confirmResult = await Swal.fire({
        position: 'center',
        width: 'auto',
        title: 'ยืนยันการลบข้อมูลผู้ป่วย?',
        icon: 'warning',

        html: `
            <div class="container">
                <div class="row my-2">
                    <div class="col">
                        <p>ลบข้อมูล ${escapeHtml(patientName)}</p>

                        <input
                            id="confirm_pass"
                            type="password"
                            class="form-control"
                            placeholder="โปรดกรอกรหัสผ่าน"
                            autocomplete="current-password"
                        >
                    </div>
                </div>
            </div>
        `,

        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',

        didOpen: () => {
            const passwordInput =
                Swal.getPopup().querySelector('#confirm_pass');

            passwordInput.focus();

            passwordInput.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    Swal.clickConfirm();
                }
            });
        },

        preConfirm: () => {
            const password = Swal
                .getPopup()
                .querySelector('#confirm_pass')
                .value;

            if (!password) {
                Swal.showValidationMessage('โปรดกรอกรหัสผ่าน');
                return false;
            }

            if (password !== gUser_pass) {
                Swal.showValidationMessage('รหัสผ่านไม่ถูกต้อง');
                return false;
            }

            return true;
        }
    });

    if (!confirmResult.isConfirmed) {
        return;
    }

    const delInfo = {
        id: webId,
        data_id: dataId,
        userId: userId
    };

    button.disabled = true;
    loadingStart();

    try {
        const fd = new FormData();

        fd.append('action', 'deleteRecord');
        fd.append('data', JSON.stringify(delInfo));

        const res = await api(mainUrl, {
            method: 'POST',
            redirect: 'follow',
            mode: 'cors',
            body: fd
        });

        // console.log('delete record response:', res);

        if (!res) {
            throw new Error('ไม่พบข้อมูลตอบกลับจากระบบ');
        }

        if (res.status === 'token_error') {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล Web ID ไม่ถูกต้อง',
                text: res.message || 'โปรดตรวจสอบ Web link',
                confirmButtonText: 'ตกลง'
            });

            return;
        }

        if (res.status !== 'success') {
            throw new Error(
                res.message || 'ระบบไม่สามารถลบข้อมูลได้'
            );
        }

        // ลบออกจาก Array ทุกตัว เพื่อป้องกันข้อมูลเก่ากลับมาแสดงอีก
        removeRecordById(gSearchData, dataId);
        removeRecordById(gCupData, dataId);
        removeRecordById(gSearchObjMain, dataId);

        // ลบกล่องข้อมูลออกจากหน้าจอ หลัง API สำเร็จแล้วเท่านั้น
        if (resultBox) {
            resultBox.remove();
        }

        await Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'ลบข้อมูลผู้ป่วยสำเร็จ!',
            showConfirmButton: false,
            timer: 2500
        });

    } catch (error) {
        console.error('deleteData error:', error);

        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ลบข้อมูลไม่สำเร็จ',
            text: error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล',
            confirmButtonText: 'ตกลง'
        });

    } finally {
        loadingEnd();

        // ปุ่มอาจถูกลบออกจากหน้าแล้ว จึงตรวจสอบก่อน
        if (button.isConnected) {
            button.disabled = false;
        }
    }
}


function removeRecordById(array, dataId) {
    if (!Array.isArray(array)) {
        return;
    }

    const index = array.findIndex(
        row => String(row[0]) === String(dataId)
    );

    if (index !== -1) {
        array.splice(index, 1);
    }
}


//-------------------------- Delete Pt Record ----------------------------------------------------------------


//-------------------------- Appointment Table ----------------------------------------------------------------
//-------------------------- Appointment Table ----------------------------------------------------------------

function populateSurgTableDates(){     
    $(function(){    
      $('input[name="date"]').datepicker({         
         minDate: -300,
         maxDate: +300,
         //changeMonth: 'true',
         //changeYear: 'true',
         navigationAsDateFormat: true,
         dateFormat: "dd/mm/yy",
         dayNamesMin: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
         monthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน",   
         "ธันวาคม"],
         monthNamesShort: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
         beforeShowDay: function (date){ if(date.getDay() === 0 
         || date.getDay() === 6)
                        {return [false];}else{return [true];}           
                        }       
              
     });
    });   
    
    letGoTrim()  
    loadingEnd();     
}

async function clickShowTable(event) {
    event.preventDefault();
    const webId = getTokenFromUrl();       // Web token
    // ตรวจสอบ Web token
    if (!webId) {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ข้อมูล Web ไม่ถูกต้อง',
            text: 'ไม่พบข้อมูล Web ID',
            confirmButtonText: 'ตกลง'
        });

        return;
    }

    if (!validateSurgApointTableForm()) {
        return;
    }

    //$('#showSurgTable').hide()
    //$('#surg_table').html('')
    $('#showSurgTable').addClass('d-none');
    $('#surg_table').empty();
    const btn = document.getElementById("btn1")
    btn.disabled = true;
    showSpin3()
        
        const date1 = $('#date1').val()
        const date2 = $('#date2').val()

        const payload = {
            id:webId,
            date1:date1,
            date2:date2,
            username:gUser_name,

        }

    try {        

        const fd = new FormData();

        fd.append('action', 'apiLoadSurgTableData');
        fd.append('data', JSON.stringify(payload));

        const res = await api(mainUrl, {
            method: 'POST',
            redirect: 'follow',
            mode: 'cors',
            body: fd
        });

        // console.log('apiLoadSurgTableData response:', res);

        if (!res) {
            throw new Error('ไม่พบข้อมูลตอบกลับจากระบบ');
        }

        if (res.status === 'token_error') {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'ข้อมูล Web ID ไม่ถูกต้อง',
                text: res.message || 'โปรดตรวจสอบ Web link',
                confirmButtonText: 'ตกลง'
            });

            return;
        }

        if (res.status !== 'success') {
            throw new Error(
                res.message || 'ระบบไม่สามารถดึงข้อมูลได้'
            );
        }

        const appoint_data = Array.isArray(res.data) ? res.data : [];
        
        const form = document.getElementById("surgTable")

        if (form) {           
            form.classList.remove('was-validated');
        }

        showSurgTable(appoint_data)
        
        
    } catch (error) {
        console.error('clickShowTable error:', error);

        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ดึงข้อมูลนัดไม่สำเร็จ',
            text: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล',
            confirmButtonText: 'ตกลง'
        });
        
    } finally {
      hideSpin3()
      btn.disabled = false;
    }
    
}

function showSurgTable(arr) {
  if (!arr || arr.length === 0) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'ไม่พบข้อมูล!',
      timer: 3000
    });

    return;
  }

  let table_result = `
    <table
      class="table table-bordered"
      id="mainTable"
      style="text-align:center;"
    >
      <thead>
        <tr>
          <th scope="col" class="dt-center">วันที่</th>
          <th scope="col" class="dt-center">ชื่อ-สกุล</th>
          <th scope="col" class="dt-center">HN</th>
          <th scope="col" class="dt-center">โทร</th>
          <th scope="col" class="dt-center">ผู้นัด</th>
        </tr>
      </thead>

      <tbody>
  `;

  arr.forEach(r => {
    const dayW = new Date(convertDateStr(r[4])).getDay();
    const colorStr = colorDay(dayW);

    table_result += `
      <tr>
        <td style="${colorStr}">${r[4]}</td>
        <td style="${colorStr}">${r[2]}</td>
        <td style="${colorStr}">${r[1]}</td>
        <td style="${colorStr}">${r[3]}</td>
        <td style="${colorStr}">${r[7]}</td>
      </tr>
    `;
  });

  table_result += `
      </tbody>
    </table>
  `;

  $('#surg_table').html(table_result);
  $('#showSurgTable').removeClass('d-none');
}


  function printSurgTable(){
     let html= `<html>
      <head>
        <base target="_top">
        <style>
          .container{
            margin:10px;
          }

          table,th,td{
              border: 1px solid #ddd;
              border-collapse: collapse;
            } 
          th,td,tr{
            padding: 5px; 
            text-align: left;
          }
          table{
            width:100%;
          }
          h3,h4,h5{
            padding: 5px;
            text-align: left;
          }
          p{
            padding: 5px;
            margin-bottom: 5px;
            font-size: 0.875em;
          }
        </style>
      </head>
      <body>
         <div class="container">
            ${document.getElementById("surg_table").innerHTML}
         </div>
      </body>
    </html>` 
    let printWin = window.open('','','left=1,top=1,width=800,height=400,toolbar=0,scrollbars=0,status=0');   
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  }

//-------------------------- Appointment Table ----------------------------------------------------------------
//-------------------------- Appointment Table ----------------------------------------------------------------


//-------------------------- Add Holidays ---------------------------------------------------------------------
//-------------------------- Add Holidays ---------------------------------------------------------------------

function populateHolidays(disabledDays) {
  const $dateInput = $('#date');

  if ($dateInput.length === 0) return;

  const disabledDateSet = new Set(
    (Array.isArray(disabledDays) ? disabledDays : [])
      .map(dateStr =>
        new Date(convertDateStr(dateStr)).toDateString()
      )
  );

  const beforeShowDay = date => {
    const isHoliday = disabledDateSet.has(date.toDateString());
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    return [!isHoliday && !isWeekend];
  };

  // ถ้ามี Datepicker อยู่แล้ว ให้อัปเดตค่า Disable จาก API
  if ($dateInput.hasClass('hasDatepicker')) {
    $dateInput.datepicker(
      'option',
      'beforeShowDay',
      beforeShowDay
    );

    $dateInput.datepicker('refresh');
    return;
  }

  // สร้าง Datepicker ครั้งแรก
  $dateInput.datepicker({
    minDate: new Date(),
    maxDate: 450,
    changeMonth: true,
    changeYear: true,
    navigationAsDateFormat: true,
    dateFormat: 'dd/mm/yy',

    dayNamesMin: [
      'อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'
    ],

    monthNames: [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ],

    monthNamesShort: [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
      'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
      'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ],

    beforeShowDay: beforeShowDay
  });
}



function showHolidayTable(arr) {
  if (arr && arr.length > 0) {
    let table_result = `
      <div class="holiday-table-header">
        <div>
          <h5 class="holiday-table-title">รายการวันหยุด</h5>
          <p class="holiday-table-subtitle">
            วันหยุดจากระบบจะแสดงเครื่องหมายล็อกและไม่สามารถลบได้
          </p>
        </div>

        <span class="holiday-count">
          ทั้งหมด ${arr.length} รายการ
        </span>
      </div>

      <div class="table-responsive holiday-table-wrapper">
        <table
          class="table table-hover align-middle mb-0"
          id="mainTable"
        >
          <thead>
            <tr>
              <th scope="col" class="text-center column-number">
                ลำดับ
              </th>

              <th scope="col" class="text-center column-date">
                วันที่
              </th>

              <th scope="col">
                ชื่อวันหยุด
              </th>

              <th scope="col" class="text-center column-action">
                จัดการ
              </th>
            </tr>
          </thead>

          <tbody>
    `;

    arr.forEach((r, index) => {
      const date = escapeHtml(r[0]);
      const holidayName = escapeHtml(r[1]);
      const dataId = escapeHtml(r[2]);

      const isSystemHoliday = r[2] === 'config_from_system';

      const displayName = isSystemHoliday
        ? 'วันหยุดที่กำหนดโดยระบบ'
        : holidayName;

      const deleteElement = isSystemHoliday
        ? `
          <span class="system-badge">
            <span aria-hidden="true">🔒</span>
            จากระบบ
          </span>
        `
        : `
          <button
            type="button"
            class="delete-holiday-btn first-hide"
            data-id="${dataId}"
            data-date="${date}"
            data-name="${holidayName}"
            onclick="delDateHoliday(event)"
            title="ลบวันหยุด"
            aria-label="ลบวันหยุด ${holidayName}"
          >
            <span aria-hidden="true">🗑️</span>
          </button>
        `;

      table_result += `
        <tr>
          <td class="text-center">
            ${index + 1}
          </td>

          <td class="text-center">
            <span class="holiday-date">
              ${date}
            </span>
          </td>

          <td>
            <span class="holiday-name">
              ${displayName}
            </span>
          </td>

          <td class="text-center">
            ${deleteElement}
          </td>
        </tr>
      `;
    });

    table_result += `
          </tbody>
        </table>
      </div>
    `;

    $('#table_holidays').html(table_result);

    $('#mainTable').DataTable({
      pageLength: 10,

      lengthMenu: [
        [5, 10, 25],
        [5, 10, 25]
      ],

      order: [[0, 'asc']],

      autoWidth: false,

      columnDefs: [
        {
          targets: [0, 1,2, 3],
          className: 'dt-center'
        },
        {
          targets: 3,
          orderable: false,
          searchable: false
        }
      ]
    });

  } else {
    $('#table_holidays').html(`
      <div class="holiday-empty">
        <div class="holiday-empty-icon">📅</div>
        <div class="holiday-empty-title">ไม่พบข้อมูลวันหยุด</div>
        <div class="holiday-empty-text">
          ยังไม่มีรายการวันหยุดที่บันทึกไว้
        </div>
      </div>
    `);
  }
}


async function delDateHoliday(e) {
  e.preventDefault();

  const button = e.currentTarget;

  const webId = getTokenFromUrl();
  const dataId = button.dataset.id;
  const dtStr = button.dataset.date || '';
  const dtName = button.dataset.name || '';
  const userId = gUserId;

  console.log("dataId: ",dataId)

  // ตรวจสอบ Web token
  if (!webId) {
    await Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'ข้อมูล Web ไม่ถูกต้อง',
      text: 'ไม่พบข้อมูล Web ID',
      confirmButtonText: 'ตกลง'
    });

    return;
  }

  // ตรวจสอบ data ID
  if (!dataId) {
    await Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'ไม่พบรหัสข้อมูลวันหยุด',
      text: 'ข้อมูลอาจถูกลบหรือมีการเปลี่ยนแปลงแล้ว',
      confirmButtonText: 'ตกลง'
    });

    return;
  }

  // ป้องกันการลบวันหยุดที่กำหนดจากระบบ
  if (dataId === 'config_from_system') {
    await Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'ไม่สามารถลบข้อมูลได้',
      text: 'วันหยุดนี้ถูกกำหนดจากระบบ',
      confirmButtonText: 'ตกลง'
    });

    return;
  }

  // เปิดกล่องยืนยันและตรวจสอบรหัสผ่าน
  const confirmResult = await Swal.fire({
    position: 'center',
    width: 'auto',
    title: 'ยืนยันการลบวันหยุด?',
    icon: 'warning',

    html: `
      <div class="container">
        <div class="row my-2">
          <div class="col text-start">

            <p class="mb-1">
              <strong>วันที่:</strong>
              ${escapeHtml(dtStr)}
            </p>

            <p class="mb-3">
              <strong>ชื่อวันหยุด:</strong>
              ${escapeHtml(dtName)}
            </p>

            <input
              id="confirm_pass"
              type="password"
              class="form-control"
              placeholder="โปรดกรอกรหัสผ่าน"
              autocomplete="current-password"
            >

          </div>
        </div>
      </div>
    `,

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก',

    didOpen: () => {
      const passwordInput = Swal
        .getPopup()
        .querySelector('#confirm_pass');

      passwordInput.focus();

      passwordInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          Swal.clickConfirm();
        }
      });
    },

    preConfirm: () => {
      const password = Swal
        .getPopup()
        .querySelector('#confirm_pass')
        .value;

      if (!password) {
        Swal.showValidationMessage('โปรดกรอกรหัสผ่าน');
        return false;
      }

      if (password !== gUser_pass) {
        Swal.showValidationMessage('รหัสผ่านไม่ถูกต้อง');
        return false;
      }

      return true;
    }
  });

  if (!confirmResult.isConfirmed) {
    return;
  }

  const delInfo = {
    id: webId,
    data_id: dataId,
    userId: userId
  };

  button.disabled = true;
  loadingStart();

  try {
    const fd = new FormData();

    fd.append('action', 'deleteHoliday');
    fd.append('data', JSON.stringify(delInfo));

    const res = await api(mainUrl, {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      body: fd
    });

    // console.log('delete holiday response:', res);

    if (!res) {
      throw new Error('ไม่พบข้อมูลตอบกลับจากระบบ');
    }

    if (res.status === 'token_error') {
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'ข้อมูล Web ID ไม่ถูกต้อง',
        text: res.message || 'โปรดตรวจสอบ Web link',
        confirmButtonText: 'ตกลง'
      });

      return;
    }

    if (res.status !== 'success') {
      throw new Error(
        res.message || 'ระบบไม่สามารถลบวันหยุดได้'
      );
    }

    gHolidaysAll = Array.isArray(res.holidaysAll) ? res.holidaysAll : [];

    gHolidays = Array.isArray(res.holidays) ? res.holidays : [];

    showHolidayTable(gHolidaysAll)
    populateHolidays(gHolidays);

    await Swal.fire({
      position: 'center',
      icon: 'success',
      text: 'ลบข้อมูลวันหยุดสำเร็จ!',
      showConfirmButton: false,
      timer: 2000
    });

  } catch (error) {
    console.error('delDateHoliday error:', error);

    await Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'ลบข้อมูลไม่สำเร็จ',
      text: error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล',
      confirmButtonText: 'ตกลง'
    });

  } finally {
    loadingEnd();

    // ตารางอาจถูกสร้างใหม่แล้ว จึงตรวจสอบก่อน
    if (button.isConnected) {
      button.disabled = false;
    }
  }
}


async function addHoliday(event){
    event.preventDefault()
    if(!validateAddHolidays()) return 

    const webId = getTokenFromUrl();  

    // ตรวจสอบ Web token
    if (!webId) {
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'ข้อมูล Web ไม่ถูกต้อง',
        text: 'ไม่พบข้อมูล Web ID',
        confirmButtonText: 'ตกลง'
      });

      return;
    }

     const btn = document.getElementById("btn1")
     btn.disabled = true;
     showSpin3()
     loadingStart();
     const date = $('#date').val()
     const name = $('#name').val()
     const obj ={
        id:webId,
        name:name,        
        date:date,       
        userId:gUserId,
     }

     try {
      const fd = new FormData();

      fd.append('action', 'addHoliday');
      fd.append('data', JSON.stringify(obj));

      const res = await api(mainUrl, {
        method: 'POST',
        redirect: 'follow',
        mode: 'cors',
        body: fd
      });

      // console.log('add holiday response:', res);

      if (!res) {
        throw new Error('ไม่พบข้อมูลตอบกลับจากระบบ');
      }

      if (res.status === 'token_error') {
        await Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'ข้อมูล Web ID ไม่ถูกต้อง',
          text: res.message || 'โปรดตรวจสอบ Web link',
          confirmButtonText: 'ตกลง'
        });

        return;
      }

      if (res.status !== 'success') {
        throw new Error(
          res.message || 'ระบบไม่สามารถบันทึกวันหยุดได้'
        );
      }      

      gHolidaysAll = Array.isArray(res.holidaysAll) ? res.holidaysAll : [];

      gHolidays = Array.isArray(res.holidays) ? res.holidays : [];

      if (res.reason === 'found_duplicate_date') {
            showHolidayTable(gHolidaysAll)
            populateHolidays(gHolidays);

            await Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'บันทึกวันหยุดซ้ำ!',
                text: 'กรุณาเลือกวันหยุดใหม่',
                showConfirmButton: true,
                timer: 2000
            });

            document.getElementById('date').value = '';
            document.getElementById('date').focus();

            return;
      }
      
      showHolidayTable(gHolidaysAll)
      populateHolidays(gHolidays);

      const form = document.getElementById('addHolidaysForm');

        if (form) {
            form.reset();
            form.classList.remove('was-validated');
        }

      await Swal.fire({
        position: 'center',
        icon: 'success',
        text: 'บันทึกวันหยุดสำเร็จ!',
        showConfirmButton: false,
        timer: 2000
      });
      
     } catch (error) {
       console.error('addHoliday error:', error);

        await Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'บันทึกวันหยุดไม่สำเร็จ',
          text: error.message || 'เกิดข้อผิดพลาดในบันทึกวันหยุด',
          confirmButtonText: 'ตกลง'
        });
      
     }finally{
      btn.disabled = false
      hideSpin3()
      loadingEnd()
     }    
}


//-------------------------- Add Holidays ---------------------------------------------------------------------
//-------------------------- Add Holidays ---------------------------------------------------------------------


const mainUrl = 'https://script.google.com/macros/s/AKfycbyMdZpy3cx0ug7rqyL-LHEq8C3FSqNkKJ8vP_pWzVmE8Zifcbz5NWz8UVlvgZ0YkdqX/exec'



document.getElementById("app").addEventListener("click",clickEventHandler);

document.addEventListener("DOMContentLoaded",async function(){
    try {
      
      console.log("========== DOMContentLoaded START ==========");       

      await initializeApp();
      const id = getTokenFromUrl();

      //console.log("[DOM] current URL =", window.location.href);
      //console.log("[DOM] id from URL =", JSON.stringify(id));

      if (!id) {
        $('#id_not_found').html('ไม่พบรหัส web id')  
        $('#login').hide()      

        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'ไม่พบรหัส web id',
          showConfirmButton: true
        });

        loadingEnd();
        //console.log("[DOM] No ID found in URL.");

        return;
      }
      
      $('#id_not_found').html('') 
      $('#id_not_found').hide()
      $('#login').show()     

      const url = mainUrl + '?id=' + encodeURIComponent(id);      

    } catch (error) {
      console.error("[DOM] Unexpected error:", error);
    } finally {       
      loadingEnd();
      console.log("========== DOMContentLoaded END ==========");
    }
    
}); 