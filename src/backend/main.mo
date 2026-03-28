import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

// Apply migration based on migration.mo

actor {
  let accessControlState = AccessControl.initState();
  let kwartirRantingMap = Map.empty<Principal, KwartirRanting>();
  let penilaianMap = Map.empty<Principal, Penilaian>();
  let adminPembantuMap = Map.empty<Principal, AdminPembantu>();
  let lampiranMap = Map.empty<Text, Lampiran>();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type KwartirRanting = {
    namaKwartirRanting : Text;
    namaKetua : Text;
    memilikiSekretariat : Bool;
    mediaSosial : Text;
    memilkiBumiPerkemahan : Bool;
    masaBakti : Text;
    nomorSk : Text;
    gudepPutera : Nat;
    gudepPuteri : Nat;
    siagaPutera : Nat;
    siagaPuteri : Nat;
    penggalangPutera : Nat;
    penggalangPuteri : Nat;
    penegakPutera : Nat;
    penegakPuteri : Nat;
    pandegaPutera : Nat;
    pandegaPuteri : Nat;
    pembina : Nat;
    satuanKaryaAktif : Nat;
    anggotaSatgasPramukaPeduli : Nat;
    pestaSiaga : Nat;
    bazarSiaga : Nat;
    rekruitmenSiagaGaruda : Nat;
    jambore : Nat;
    dianpinru : Nat;
    lombaTingkatII : Nat;
    lombaGladiTangkasMedan : Nat;
    ikutLombaTingkatIII : Nat;
    rekruitmenPenggalangGaruda : Nat;
    raimuna : Nat;
    dianpinsat : Nat;
    mengirimkanUtusanKpd : Nat;
    mengirimkanUtusanLpk : Nat;
    mengirimkanUtusanDewanKerja : Nat;
    mengirimkanUtusanLpkdk : Nat;
    rekruitmenPenegakGaruda : Nat;
    perkemahanBaktiSatuanKarya : Nat;
    partisipasiPenangananBencanaC3 : Nat;
    partisipasiKaryaBaktiNatalC3 : Nat;
    partisipasiKaryaBaktiLebaranC3 : Nat;
    karangPamitran : Nat;
    kmd : Nat;
    kml : Nat;
    mengirimkanUtusanKpdDewasa : Nat;
    mengirimkanUtusanKpl : Nat;
    mengirimkanUtusanKpdK : Nat;
    orientasiMajelisPembimbing : Nat;
    partisipasiPenangananBencanaC4 : Nat;
    partisipasiKaryaBaktiNatalC4 : Nat;
    partisipasiKaryaBaktiLebaranC4 : Nat;
    // C.5 Dewan Kerja Ranting
    dewanKerjaRantingRapat : Nat;
    dewanKerjaRantingKegiatan : Nat;
    dewanKerjaRantingPeserta : Nat;
    // C.6 Satuan Karya
    satuanKaryaKegiatan : Nat;
    satuanKaryaPerkemahan : Nat;
    // C.7 Pusdiklat
    pusdiklatKegiatan : Nat;
    pusdiklatPeserta : Nat;
    owner : Principal;
    submittedAt : Int;
  };

  public type Penilaian = {
    kwartirRantingOwner : Principal;
    skorProfil : Float;
    skorPotensi : Float;
    skorKegiatan : Float;
    skorDewanKerja : Float;
    skorSatuanKarya : Float;
    skorPusdiklat : Float;
    skorTotal : Float;
    assessedBy : Principal;
    assessedAt : Int;
    namaKegiatan : Text;
  };

  public type Lampiran = {
    id : Text;
    owner : Principal;
    kategoriKegiatan : Text;
    namaFile : Text;
    blob : ?Storage.ExternalBlob;
    uploadedAt : Int;
    uploadedBy : Principal;
  };

  public type AdminPembantu = {
    principal : Principal;
    namaKwartirRanting : Text;
    status : { #pending; #approved };
  };

  module AdminPenilaian {
    public type T = (KwartirRanting, ?Penilaian);

    public func compare(a : T, b : T) : Order.Order {
      let (_ , penA ) = a;
      let (_ , penB ) = b;
      let scoreA = switch (penA) { case (null) { 0.0 }; case (?p) { p.skorTotal } };
      let scoreB = switch (penB) { case (null) { 0.0 }; case (?p) { p.skorTotal } };
      Float.compare(scoreB, scoreA); // Descending order
    };
  };

  public type CreateOrUpdateKwartirRantingInput = {
    namaKwartirRanting : Text;
    namaKetua : Text;
    memilikiSekretariat : Bool;
    mediaSosial : Text;
    memilkiBumiPerkemahan : Bool;
    masaBakti : Text;
    nomorSk : Text;
    gudepPutera : Nat;
    gudepPuteri : Nat;
    siagaPutera : Nat;
    siagaPuteri : Nat;
    penggalangPutera : Nat;
    penggalangPuteri : Nat;
    penegakPutera : Nat;
    penegakPuteri : Nat;
    pandegaPutera : Nat;
    pandegaPuteri : Nat;
    pembina : Nat;
    satuanKaryaAktif : Nat;
    anggotaSatgasPramukaPeduli : Nat;
    pestaSiaga : Nat;
    bazarSiaga : Nat;
    rekruitmenSiagaGaruda : Nat;
    jambore : Nat;
    dianpinru : Nat;
    lombaTingkatII : Nat;
    lombaGladiTangkasMedan : Nat;
    ikutLombaTingkatIII : Nat;
    rekruitmenPenggalangGaruda : Nat;
    raimuna : Nat;
    dianpinsat : Nat;
    mengirimkanUtusanKpd : Nat;
    mengirimkanUtusanLpk : Nat;
    mengirimkanUtusanDewanKerja : Nat;
    mengirimkanUtusanLpkdk : Nat;
    rekruitmenPenegakGaruda : Nat;
    perkemahanBaktiSatuanKarya : Nat;
    partisipasiPenangananBencanaC3 : Nat;
    partisipasiKaryaBaktiNatalC3 : Nat;
    partisipasiKaryaBaktiLebaranC3 : Nat;
    karangPamitran : Nat;
    kmd : Nat;
    kml : Nat;
    mengirimkanUtusanKpdDewasa : Nat;
    mengirimkanUtusanKpl : Nat;
    mengirimkanUtusanKpdK : Nat;
    orientasiMajelisPembimbing : Nat;
    partisipasiPenangananBencanaC4 : Nat;
    partisipasiKaryaBaktiNatalC4 : Nat;
    partisipasiKaryaBaktiLebaranC4 : Nat;
    dewanKerjaRantingRapat : Nat;
    dewanKerjaRantingKegiatan : Nat;
    dewanKerjaRantingPeserta : Nat;
    satuanKaryaKegiatan : Nat;
    satuanKaryaPerkemahan : Nat;
    pusdiklatKegiatan : Nat;
    pusdiklatPeserta : Nat;
  };

  public type CreateOrUpdatePenilaianInput = {
    kwartirRantingOwner : Principal;
    skorProfil : Float;
    skorPotensi : Float;
    skorKegiatan : Float;
    skorDewanKerja : Float;
    skorSatuanKarya : Float;
    skorPusdiklat : Float;
    skorTotal : Float;
    namaKegiatan : Text;
  };

  public type AddLampiranInput = {
    kategoriKegiatan : Text;
    namaFile : Text;
    blob : ?Storage.ExternalBlob;
  };

  public shared ({ caller }) func createOrUpdateKwartirRanting(input : CreateOrUpdateKwartirRantingInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let currentTime = Time.now();
    let kwartirRanting : KwartirRanting = {
      input with owner = caller;
      submittedAt = currentTime;
    };
    kwartirRantingMap.add(caller, kwartirRanting);
  };

  public query ({ caller }) func getMyKwartirRanting() : async ?KwartirRanting {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    kwartirRantingMap.get(caller);
  };

  public query ({ caller }) func getKwartirRantingByOwner(owner : Principal) : async ?KwartirRanting {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAdminPemb = isAdminPembantu(caller);
    let isSelf = Principal.equal(caller, owner);
    if (not (isAdmin or isAdminPemb or isSelf)) {
      Runtime.trap("Unauthorized: Can only view your own data or must be admin/admin pembantu");
    };
    kwartirRantingMap.get(owner);
  };

  public query ({ caller }) func allKwartirRanting() : async [KwartirRanting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    kwartirRantingMap.values().toArray();
  };

  public shared ({ caller }) func submitKwartirRanting() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let existing = kwartirRantingMap.get(caller);
    switch (existing) {
      case (null) { Runtime.trap("Kwartir Ranting not found") };
      case (?k) {
        let updated = { k with submittedAt = Time.now() };
        kwartirRantingMap.add(caller, updated);
      };
    };
  };

  public shared ({ caller }) func createOrUpdatePenilaian(input : CreateOrUpdatePenilaianInput) : async () {
    let canAccess = AccessControl.isAdmin(accessControlState, caller) or isAdminPembantu(caller);
    if (not canAccess) {
      Runtime.trap("Unauthorized: Only admins or admin pembantu can perform this action");
    };

    let penilaian : Penilaian = {
      input with assessedBy = caller;
      assessedAt = Time.now();
    };
    penilaianMap.add(input.kwartirRantingOwner, penilaian);
  };

  public shared ({ caller }) func deletePenilaian(owner : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only main admin can delete penilaian data");
    };
    ignore penilaianMap.remove(owner);
  };

  public query ({ caller }) func getPenilaianForOwner(owner : Principal) : async ?Penilaian {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAdminPemb = isAdminPembantu(caller);
    let isSelf = Principal.equal(caller, owner);
    if (not (isAdmin or isAdminPemb or isSelf)) {
      Runtime.trap("Unauthorized: Can only view your own assessment or must be admin/admin pembantu");
    };
    penilaianMap.get(owner);
  };

  public query ({ caller }) func getAllSortedByScore() : async [AdminPenilaian.T] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAdminPemb = isAdminPembantu(caller);
    if (not (isAdmin or isAdminPemb)) {
      Runtime.trap("Unauthorized: Only admins or admin pembantu can view rankings");
    };
    let entries : [AdminPenilaian.T] = kwartirRantingMap.entries().toArray().map(
      func((owner, kwartir)) : AdminPenilaian.T {
        (kwartir, penilaianMap.get(owner));
      }
    );
    entries.sort();
  };

  // Lampiran functions
  func genLampiranId(caller : Principal, kategori : Text, timestamp : Int) : Text {
    caller.toText() # "-" # kategori # "-" # timestamp.toText();
  };

  public shared ({ caller }) func addLampiran(input : AddLampiranInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload lampiran");
    };
    let ts = Time.now();
    let id = genLampiranId(caller, input.kategoriKegiatan, ts);
    let lampiran : Lampiran = {
      id;
      owner = caller;
      kategoriKegiatan = input.kategoriKegiatan;
      namaFile = input.namaFile;
      blob = input.blob;
      uploadedAt = ts;
      uploadedBy = caller;
    };
    lampiranMap.add(id, lampiran);
    id;
  };

  public shared ({ caller }) func deleteLampiran(id : Text) : async () {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    switch (lampiranMap.get(id)) {
      case (null) { Runtime.trap("Lampiran not found") };
      case (?l) {
        if (not (isAdmin or Principal.equal(l.owner, caller))) {
          Runtime.trap("Unauthorized: Only owner or admin can delete lampiran");
        };
        ignore lampiranMap.remove(id);
      };
    };
  };

  public query ({ caller }) func getMyLampiran() : async [Lampiran] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    lampiranMap.values().toArray().filter(
      func(l : Lampiran) : Bool { Principal.equal(l.owner, caller) }
    );
  };

  public query ({ caller }) func getLampiranByOwner(owner : Principal) : async [Lampiran] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAdminPemb = isAdminPembantu(caller);
    let isSelf = Principal.equal(caller, owner);
    if (not (isAdmin or isAdminPemb or isSelf)) {
      Runtime.trap("Unauthorized");
    };
    lampiranMap.values().toArray().filter(
      func(l : Lampiran) : Bool { Principal.equal(l.owner, owner) }
    );
  };

  public query ({ caller }) func getAllLampiran() : async [Lampiran] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isAdminPemb = isAdminPembantu(caller);
    if (not (isAdmin or isAdminPemb)) {
      Runtime.trap("Unauthorized: Only admins can view all lampiran");
    };
    lampiranMap.values().toArray();
  };

  public shared ({ caller }) func addAdminPembantu(namaKwartirRanting : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let existing = adminPembantuMap.get(caller);
    switch (existing) {
      case (?a) {
        switch (a.status) {
          case (#approved) { Runtime.trap("You are already an approved admin pembantu") };
          case (#pending) { Runtime.trap("Your request is already pending") };
        };
      };
      case (null) {
        let newAdmin : AdminPembantu = {
          principal = caller;
          namaKwartirRanting;
          status = #pending;
        };
        adminPembantuMap.add(caller, newAdmin);
      };
    };
  };

  public shared ({ caller }) func approveAdminPembantu(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let admin = getAdminPembantu(principal);
    let updated = { admin with status = #approved };
    adminPembantuMap.add(principal, updated);
  };

  public shared ({ caller }) func removeAdminPembantu(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let admin = getAdminPembantu(principal);
    switch (admin.status) {
      case (#pending) { ignore adminPembantuMap.remove(principal) };
      case (#approved) { ignore adminPembantuMap.remove(principal) };
    };
  };

  public query ({ caller }) func pendingAdminPembantu() : async [AdminPembantu] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let pending = adminPembantuMap.entries().toArray().map(
      func((p, a)) : AdminPembantu { a }
    );
    let filtered = pending.filter(
      func(a) : Bool {
        switch (a.status) {
          case (#pending) { true };
          case (#approved) { false };
        };
      }
    );
    filtered;
  };

  public query ({ caller }) func isAdminPembantuCheck() : async Bool {
    isAdminPembantu(caller);
  };

  public query ({ caller }) func isCallerAdminPembantu() : async Bool {
    isAdminPembantu(caller);
  };

  func isAdminPembantu(principal : Principal) : Bool {
    switch (adminPembantuMap.get(principal)) {
      case (null) { false };
      case (?admin) {
        switch (admin.status) {
          case (#pending) { false };
          case (#approved) { true };
        };
      };
    };
  };

  func getAdminPembantu(principal : Principal) : AdminPembantu {
    switch (adminPembantuMap.get(principal)) {
      case (null) { Runtime.trap("Admin Pembantu not found") };
      case (?admin) { admin };
    };
  };
};
