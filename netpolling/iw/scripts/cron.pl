#!/usr/bin/perl -w
use strict;

my $cron = `cat /etc/crontab`;
if (!($cron =~ /\*\/1 +\* +\* +\* +\* +root +\/opt\/netpolling\/netpolling\/iw\/scanner.py/))
    {
		$cron =~ s/#$//;
		$cron = "$cron\n*/1 * * * * root /opt/sml/scripts/scanner.py\n#";
		open(FD, '>/etc/crontab');
		print FD $cron;
		close (FD);
	}