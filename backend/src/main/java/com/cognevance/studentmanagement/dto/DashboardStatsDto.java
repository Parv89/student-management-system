package com.cognevance.studentmanagement.dto;

import java.util.Map;

/**
 * Data Transfer Object for Dashboard metrics and counts.
 */
public class DashboardStatsDto {

    private long totalStudents;
    private long activeStudents;
    private long inactiveStudents;
    private long availableCourses;
    private Map<String, Long> courseDistribution;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalStudents, long activeStudents, long inactiveStudents,
                             long availableCourses, Map<String, Long> courseDistribution) {
        this.totalStudents = totalStudents;
        this.activeStudents = activeStudents;
        this.inactiveStudents = inactiveStudents;
        this.availableCourses = availableCourses;
        this.courseDistribution = courseDistribution;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(long activeStudents) {
        this.activeStudents = activeStudents;
    }

    public long getInactiveStudents() {
        return inactiveStudents;
    }

    public void setInactiveStudents(long inactiveStudents) {
        this.inactiveStudents = inactiveStudents;
    }

    public long getAvailableCourses() {
        return availableCourses;
    }

    public void setAvailableCourses(long availableCourses) {
        this.availableCourses = availableCourses;
    }

    public Map<String, Long> getCourseDistribution() {
        return courseDistribution;
    }

    public void setCourseDistribution(Map<String, Long> courseDistribution) {
        this.courseDistribution = courseDistribution;
    }
}
