function KillChildren
{
    Param(
        [Parameter(Mandatory=$True,Position=1)]
            [int]$parentProcessId
    )

    Get-WmiObject win32_process | Where-Object {$_.ParentProcessId -eq $parentProcessId} | echo $_.ProcessId
    Get-WmiObject win32_process | Where-Object {$_.ParentProcessId -eq $parentProcessId} | echo $_.ProcessId
}

KillChildren $args[0]