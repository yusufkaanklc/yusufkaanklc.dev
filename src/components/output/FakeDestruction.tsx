"use client";

import { useEffect, useState, useRef } from "react";

const FAKE_PATHS = [
  "/usr/bin/node", "/usr/lib/libssl.so", "/etc/passwd", "/etc/hosts",
  "/var/log/syslog", "/home/user/.bashrc", "/usr/share/fonts/",
  "/opt/lampp/htdocs/", "/usr/local/bin/npm", "/etc/nginx/nginx.conf",
  "/var/www/html/index.html", "/usr/lib/python3/", "/boot/vmlinuz",
  "/usr/bin/git", "/etc/ssh/sshd_config", "/usr/lib/libc.so.6",
  "/home/user/.config/", "/usr/share/icons/", "/var/cache/apt/",
  "/usr/bin/curl", "/etc/resolv.conf", "/usr/lib/x86_64-linux-gnu/",
  "/dev/sda1", "/proc/cpuinfo", "/sys/kernel/", "/tmp/.X11-unix/",
  "/usr/bin/python3", "/etc/fstab", "/usr/sbin/iptables",
  "/home/user/Documents/", "/usr/lib/systemd/", "/etc/crontab",
  "/var/mail/", "/usr/share/man/", "/boot/grub/grub.cfg",
  "/usr/bin/bash", "/etc/profile", "/usr/lib/firmware/",
  "/home/user/.ssh/id_rsa", "/usr/local/lib/", "/etc/shadow",
];

const CORRUPT_CHARS = "█▓▒░▄▀▐▌╔╗╚╝║═╬╣╠╩╦┃━┏┓┗┛";

const REBOOT_LINES = [
  "BIOS POST... OK",
  "Memory Test: 16384 MB OK",
  "Detecting hardware...",
  "CPU: Intel Core i7-13700K @ 5.40GHz",
  "GPU: NVIDIA GeForce RTX 4090",
  "Storage: 1TB NVMe SSD",
  "Network: Ethernet Link Detected",
  "",
  "Loading GRUB...",
  "Booting 'Portfolio OS 2.0'...",
  "",
  "[  OK  ] Started System Restore Service",
  "[  OK  ] Reached target Basic System",
  "[  OK  ] Restoring files from backup...",
  "[  OK  ] All systems nominal",
  "",
  "Restore complete.",
];

type Phase = "deleting" | "corrupting" | "blackout" | "reboot" | "done";

export function FakeDestruction() {
  const [phase, setPhase] = useState<Phase>("deleting");
  const [deleteLines, setDeleteLines] = useState<string[]>([]);
  const [corruptText, setCorruptText] = useState("");
  const [rebootLines, setRebootLines] = useState<string[]>([]);
  const [finalMessage, setFinalMessage] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  // Phase 1: Deleting files
  useEffect(() => {
    if (phase !== "deleting") return;

    let index = 0;
    intervalRef.current = setInterval(() => {
      if (index >= FAKE_PATHS.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase("corrupting");
        return;
      }
      setDeleteLines((prev) => [...prev, `rm: removing '${FAKE_PATHS[index]}'`]);
      index++;
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  // Phase 2: Character corruption
  useEffect(() => {
    if (phase !== "corrupting") return;

    let tick = 0;
    const maxTicks = 20;
    const interval = setInterval(() => {
      if (tick >= maxTicks) {
        clearInterval(interval);
        setPhase("blackout");
        return;
      }
      const line = Array.from({ length: 60 }, () =>
        CORRUPT_CHARS[Math.floor(Math.random() * CORRUPT_CHARS.length)]
      ).join("");
      setCorruptText((prev) => prev + line + "\n");
      tick++;
    }, 80);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: Blackout -> Reboot
  useEffect(() => {
    if (phase !== "blackout") return;

    const timer = setTimeout(() => {
      setPhase("reboot");
    }, 2000);

    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 4: Reboot sequence
  useEffect(() => {
    if (phase !== "reboot") return;

    let index = 0;
    const interval = setInterval(() => {
      if (index >= REBOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 800);
        return;
      }
      setRebootLines((prev) => [...prev, REBOOT_LINES[index]]);
      index++;
    }, 150);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 5: Done
  useEffect(() => {
    if (phase !== "done") return;

    const timer = setTimeout(() => {
      setFinalMessage(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <>
      {/* Deleting phase */}
      {phase === "deleting" && (
        <div className="text-t-red font-mono text-xs leading-tight max-h-40 overflow-hidden">
          {deleteLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {/* Corruption phase */}
      {phase === "corrupting" && (
        <div className="text-t-red font-mono text-xs leading-tight animate-text-corrupt">
          {corruptText}
        </div>
      )}

      {/* Blackout overlay */}
      {(phase === "blackout" || phase === "reboot") && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
          }}
        >
          {phase === "reboot" && (
            <div className="text-t-green text-xs sm:text-sm max-w-xl p-8 w-full">
              {rebootLines.map((line, i) => (
                <div key={i} className={line.startsWith("[  OK") ? "text-t-green" : "text-fg-muted"}>
                  {line || "\u00A0"}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Final message */}
      {finalMessage && (
        <div className="mt-2">
          <span className="text-t-green font-bold">Nice try ;)</span>
          <span className="text-fg-muted ml-2">— All systems restored. No files were harmed.</span>
        </div>
      )}
    </>
  );
}
