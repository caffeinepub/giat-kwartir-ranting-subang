import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  let kwartirRantingMap = Map.empty<Principal, KwartirRanting>();
  let penilaianMap = Map.empty<Principal, Penilaian>();
  let adminPembantuMap = Map.empty<Principal, AdminPembantu>();

  include MixinAuthorization(accessControlState);

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
    owner : Principal;
    submittedAt : Int;
  };

  public type Penilaian = {
    kwartirRantingOwner : Principal;
    skorProfil : Float;
    skorPotensi : Float;
    skorKegiatan : Float;
    skorTotal : Float;
    assessedBy : Principal;
    assessedAt : Int;
    namaKegiatan : Text;
  };

  public type AdminPembantu = {
    principal : Principal;
    namaKwartirRanting : Text;
    status : { #pending; #approved };
  };

  module AdminPenilaian {
    public type T = (KwartirRanting, ?Penilaian);

    public func compare(a : T, b : T) : Order.Order {
      let ( _, penA ) = a;
      let ( _, penB ) = b;
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
  };

  public type CreateOrUpdatePenilaianInput = {
    kwartirRantingOwner : Principal;
    skorProfil : Float;
    skorPotensi : Float;
    skorKegiatan : Float;
    skorTotal : Float;
    namaKegiatan : Text;
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
    penilaianMap.get(owner);
  };

  public query ({ caller }) func getAllSortedByScore() : async [AdminPenilaian.T] {
    let entries : [AdminPenilaian.T] = kwartirRantingMap.entries().toArray().map(
      func((owner, kwartir)) : AdminPenilaian.T {
        (kwartir, penilaianMap.get(owner));
      }
    );
    entries.sort();
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
