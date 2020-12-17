function KillChildren
{
    Param(
        [Parameter(Mandatory=$True,Position=1)]
            [int]$parentProcessId
    )

    Get-WmiObject win32_process | Where-Object {$_.ParentProcessId -eq $parentProcessId} | ForEach-Object { KillChildren $_.ProcessId }
    Get-WmiObject win32_process | Where-Object {$_.ParentProcessId -eq $parentProcessId} | ForEach-Object { Stop-Process $_.ProcessId 2>$null }
}

KillChildren $args[0]